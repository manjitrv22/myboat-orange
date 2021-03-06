import { useNavigation } from "@react-navigation/native";
import React, { useState, useEffect } from "react";
import {
  Text,
  View,
  StyleSheet,
  ImageBackground,
  TouchableOpacity,
  ScrollView,
  FlatList,
  Image,
  I18nManager,
} from "react-native";
import I18n from "../../Translations/i18";
import { Calendar  , LocaleConfig} from "react-native-calendars";
import { Icon, Input, Card } from "react-native-elements";
import Header from "../../Components/Header";
import { Colors, FontFamily, Sizes } from "../../Constants/Constants";
import AsyncStorage from "@react-native-async-storage/async-storage";
import config from "../../Constants/config";
import axios from "axios";
import { Loading } from "../../Components/Loader";
import { connect, useDispatch } from "react-redux";
import moment from "moment";
const CalenderView = (props) => {
  const today = moment().format("YYYY-MM-DD");

  console.log(props, "today");
  const navigation = useNavigation();
  const [Data, setData] = useState([]);
  const [allData, setAllData] = useState(null);
  const [upcomingTripData, setUpcomingTripData] = useState([]);
  const [loader, setLoader] = useState(false);
  const [isFetching, setIsFetching] = useState(false);

  const [permissionArr, serPermissionArr] = useState([]);

  // useEffect(() => {
  //   navigation.addListener('focus', () => {
  //     getData();
  //   });
  //   getData();
  // }, []);

  useEffect(() => {
    const unsubscribe = props.navigation.addListener("focus", () => {
      console.log("in useEfect calender>>>>>>>>>>>.");
      getLoginuserInfo();
      laungugaelocal();
    });
    return unsubscribe;
  }, [props.navigation]);

  //getting user information
  const getLoginuserInfo = async () => {
    let userInfo = await AsyncStorage.getItem("userInfo");
    let parsedInfo = JSON.parse(userInfo);
    console.log(parsedInfo, "parsedInfo >>>>>>>>>>>>>");

    if (parsedInfo?.role_id == 2) {
      let url =
        config.apiUrl + "/get-permissions.php?user_id_post=" + parsedInfo.id;
      axios
        .get(url)
        .then((res) => {
          console.log(res, "res getting permission");
          setLoader(false);
          if (
            res?.data?.success === "true" &&
            res &&
            res.data &&
            res.data.permissions &&
            res.data.permissions.length > 0 &&
            res.data.permissions[0].view_unavailability_permission === 1
          ) {
            serPermissionArr(res.data.permissions);
            getData();
          } else {
            alert("You do not have permission to see unavailable page.");
          }
        })
        .catch((err) => console.log(err));
    } else {
      getData();
    }
  };

  const logout = async () => {
    await AsyncStorage.clear();
    props.navigation.reset({
      index: 0,
      routes: [{ name: "Login" }],
    });
  };

 const  laungugaelocal= () =>{
    // const user = this.context
  // console.log('user :>> ', user);
  if (props.language_id== 1  ){
    LocaleConfig.locales['ar'] = {
      monthNames: [
        '??????????',
        '????????????',
        '????????',
        '??????????',
        '????????',
        '??????????',
        '??????????',
        '??????????',
        '????????????',
        '????????????',
        '????????????',
        '????????????'
      ],
      monthNamesShort: ['Janv.', 'F??vr.', 'Mars', 'Avril', 'Mai', 'Juin', 'Juil.', 'Ao??t', 'Sept.', 'Oct.', 'Nov.', 'D??c.'],
      dayNames: ['Dimanche', 'Lundi', 'Mardi', 'Mercredi', 'Jeudi', 'Vendredi', 'Samedi'],
      dayNamesShort: ['??????','??????????' , '????????????????', '????????????????', '????????????', '????????????', '??????????'],
      today: "Aujourd'hui"
    };
    LocaleConfig.defaultLocale = 'ar';
   
  } else {
    LocaleConfig.locales['en'] = {
      monthNames: [
        'January',
        'February',
        'March',
        'April',
        'May',
        'June',
        'July',
        'August',
        'September',
        'October',
        'November',
        'December'
      ],
      monthNamesShort: ['Janv.', 'F??vr.', 'Mars', 'Avril', 'Mai', 'Juin', 'Juil.', 'Ao??t', 'Sept.', 'Oct.', 'Nov.', 'D??c.'],
      dayNames: ['Dimanche', 'Lundi', 'Mardi', 'Mercredi', 'Jeudi', 'Vendredi', 'Samedi'],
      dayNamesShort: ['Sun','Mon' , 'Tue', 'Wed', 'Thr', 'Fri', 'Sat'],
      today: "Aujourd'hui"
    };
    LocaleConfig.defaultLocale = 'en';
  }
}
  
  const getData = async () => {
    let userInfo = await AsyncStorage.getItem("userInfo");
    let parsedInfo = JSON.parse(userInfo);
    setLoader(true);

    let url =
      config.apiUrl + "/unavailable_list.php?user_id_post=" + parsedInfo.id;
      console.log(url,'url here 154');
    axios
      .get(url)
      .then((res) => {
        console.log(res, "checking unavailble");
        if (res.data.success === "true") {
          getBookingListForOwner();
          setAllData(res.data.unavailabe_arr);
        } else {
          if (res?.data?.status_code == 405) {
            logout();
          }
          if (props.language_id == 0) alert(res.data.msg[0]);
          else alert(res.data.msg[1]);
          setLoader(false);
        }
      })
      .catch((err) => console.log(err));
  };

  const getBookingListForOwner = async () => {
    let userInfo = await AsyncStorage.getItem("userInfo");
    let parsedInfo = JSON.parse(userInfo);

    let url =
      config.apiUrl + "/booking_list_owner.php?user_id_post=" + parsedInfo.id;
    axios
      .get(url)
      .then((res) => {
        console.log(res, "res in getBookingListForOwner");
        setLoader(false);
        setIsFetching(false);
        if (res.data.success === "true") {
          // && res.data.booking_arr?.length
          res.data.upcoming_booking_arr?.length &&
            setUpcomingTripData(res.data.upcoming_booking_arr);
        } else {
          if (props.language_id == 0) alert(res.data.msg[0]);
          else alert(res.data.msg[1]);
        }
      })
      .catch((err) => console.log(err));
  };
  // var dates = ['2021-08-23', '2021-08-26', '2021-08-10']

  const gotoSelectedDate = ({ data }) => {
    console.log(data, "on press 147");
    if (data && data.dateString < today) {
      return alert("Please select current or above date for unavailibity.");
    }
    navigation.navigate("SelectedDate", {
      data,
      manage_unavailability_permission:
        permissionArr &&
        permissionArr.length > 0 &&
        permissionArr.manage_unavailability_permission
          ? 1
          : 0,
    });
  };
  const deleteData = async (id) => {
    let userInfo = await AsyncStorage.getItem("userInfo");
    let parsedInfo = JSON.parse(userInfo);
    setLoader(true);
    setIsFetching(true);
    let url =
      config.apiUrl +
      "/unavailable_delete.php?user_id_post=" +
      parsedInfo.id +
      "&unavailable_id=" +
      id;
    // + parsedInfo.id;

    console.log(url, "test url");
    axios
      .get(url)
      .then((res) => {
        console.log(res, "res in calender");
        setLoader(false);
        setIsFetching(false);
        if (res.data.success === "true") {
          getData();
        } else {
          if (props.language_id == 0) alert(res.data.msg);
          else alert(res.data.msg);
        }
      })
      .catch((err) => console.log(err));
  };
  const getDayColor = (date, preference) => {
    // console.log(upcomingTripData, "upcomingTripDataupcomingTripData");
    let color = "white";
    let textColor = "#000";
    let found = false;
    let upcomingTripCount = 0;
    // if (today == moment().format("YYYY-MM-DD")) {
    //   color = Colors.orange;
    //   textColor = "#000";
    // }
    allData != "NA" &&
      allData?.length &&
      allData.map((item) => {
        if (date?.dateString === item.date) {
          textColor = "#fff";
          color = "red";
        }
        upcomingTripData !== "NA2" &&
          upcomingTripData.length > 0 &&
          upcomingTripData.filter((innerItem) => {
            if (item.date === innerItem.date) {
              if (date.dateString === innerItem.date) {
                color = "yellow";
                textColor = "#000";
                found = true;
              }
            }
          });
      });
    upcomingTripData !== "NA2" &&
      upcomingTripData.length > 0 &&
      upcomingTripData.filter((innerItem) => {
        if (date.dateString === innerItem.date && !found) {
          color = "green";
          textColor = "#fff";
        }

        //   else color = 'green';
      });

    return preference ? color : textColor;
  };
  const Cal = ({ selectDate }) => {
    const IconLeft = () => (
      <Icon name="left" type="antdesign" size={20} color={Colors.black} />
    );
    const IconRight = () => (
      <Icon name="right" type="antdesign" size={20} color={Colors.black} />
    );
    return (
      <View>
        <Calendar
          // onDayPress={(day) => { selecteddate.push(day.dateString), gotoSelectedDate({ data: day }) }}
          current={today}
          minDate={new Date()}
          dayComponent={({ date, state }) => {
            return (
              <TouchableOpacity
                style={{
                  backgroundColor: getDayColor(date, 1),
                  elevation: 5,
                  height: 40,
                  width: 40,
                  borderRadius: 20,
                  textAlign: "center",
                  justifyContent: "center",
                }}
                onPress={() => {
                  gotoSelectedDate({ data: date });
                }}
              >
                <Text
                  style={{
                    textAlign: "center",
                    color: getDayColor(date, 0),
                    fontFamily: FontFamily.bold,
                  }}
                >
                  {date.day}
                </Text>
              </TouchableOpacity>
            );
          }}
          onDayLongPress={(day) => {
            console.log(selecteddate);
          }}
          // renderArrow={(direction) => (
          //   <Icon
          //     type="ionicon"
          //     color={Colors.orange}
          //     name={
          //       direction === "left"
          //         ? this.props.language_id == 1
          //           ? "arrow-forward"
          //           : "arrow-back"
          //         : this.props.language_id == 1
          //         ? "arrow-back"
          //         : "arrow-forward"
          //     }
          //   />
          // )}
          monthFormat={"MMMM , yyyy"}
          hideExtraDays
          onMonthChange={(month) => {}}
          renderArrow={(direction) =>
             (
              <Icon
                  type="ionicon"
                  color={Colors.orange}
                  name={
                    direction === "left"
                      ? props.language_id == 1
                        ? "arrow-forward"
                        : "arrow-back"
                      : props.language_id == 1
                      ? "arrow-back"
                      : "arrow-forward"
                  }
                />
             )
            // direction === "left" ? <IconLeft /> : <IconRight />
          }
          onPressArrowLeft={(subtractMonth) => subtractMonth()}
          onPressArrowRight={(addMonth) => addMonth()}
          enableSwipeMonths={true}
          style={{
            // position:"absolute",
            width: "100%",
            alignSelf: "center",
            borderTopLeftRadius: 30,
            borderTopEndRadius: 30,
          }}
          theme={{
            "stylesheet.calendar.header": {
              week: {
                marginTop: 15,
                flexDirection: "row",
                justifyContent: "space-between",
                paddingHorizontal: 5,
              },
              dayTextAtIndex0: {
                fontFamily: FontFamily.default,
                color: "#000",
              },
              dayTextAtIndex1: {
                fontFamily: FontFamily.default,
                color: "#000",
              },
              dayTextAtIndex2: {
                fontFamily: FontFamily.default,
                color: "#000",
              },
              dayTextAtIndex3: {
                fontFamily: FontFamily.default,
                color: "#000",
              },
              dayTextAtIndex4: {
                fontFamily: FontFamily.default,
                color: "#000",
              },
              dayTextAtIndex5: {
                fontFamily: FontFamily.default,
                color: "#000",
              },
              dayTextAtIndex6: {
                fontFamily: FontFamily.default,
                color: "#000",
              },
              header: {
                backgroundColor: Colors.cal_head,
                flexDirection: "row",
                justifyContent: "space-between",
                borderTopEndRadius: 30,
                borderTopLeftRadius: 30,
                width: "102%",
                height: 60,
                alignSelf: "center",
                marginVertical: 1,
                alignItems: "center",
                fontFamily: FontFamily.bold,
              },
            },
            textMonthFontFamily: FontFamily.semi_bold,
          }}
        />
        <View>
          <TouchableOpacity style={sb.btn1}>
            <Text style={sb.btn1Text}>{I18n.translate("submit")}</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  };
  return (
    <View style={{ flex: 1, backgroundColor: Colors.white }}>
      <Header name={I18n.translate("manage_unavailability")} imgBack={true} isarbic={props.language_id==1 ? 1 : 0} />
      <View style={sb.SEC2}>
        <View style={{ marginTop: 30 }}>
          <ScrollView showsVerticalScrollIndicator={false}>
            <Cal />
            <View>
              <Text
                style={{
                  fontFamily: FontFamily.semi_bold,
                  fontSize: 16,
                  paddingHorizontal: 10,
                }}
              >
                {I18n.translate("unavailablity")}
              </Text>
              {loader ? (
                <Loading />
              ) : (
                <View>
                  {allData !== "NA" ? (
                    <View>
                      {allData?.length &&
                        allData != "NA" &&
                        allData.map((item, index) => {
                          return (
                            <View key={index}>
                              <Card
                                containerStyle={{
                                  height: 50,
                                  paddingVertical: 2,
                                  justifyContent: "center",
                                  borderRadius: 12,
                                }}
                              >
                                <View
                                  style={{
                                    flexDirection: "row",
                                    alignItems: "center",
                                    justifyContent: "space-between",
                                  }}
                                >
                                  <View
                                    style={{
                                      flexDirection: "row",
                                      alignItems: "center",
                                    }}
                                  >
                                    <View
                                      style={{ flex: 1, flexDirection: "row" }}
                                    >
                                      <Icon
                                        name="calendar"
                                        type="antdesign"
                                        color={Colors.orange}
                                      />
                                      <Text
                                        style={{
                                          alignSelf: "center",
                                          fontSize: 14,
                                          fontFamily: FontFamily.semi_bold,
                                          marginHorizontal: 7,
                                        }}
                                      >
                                        {item.date}
                                      </Text>
                                    </View>
                                    <View
                                      style={{
                                        flexDirection: "row",
                                        flex: 2,
                                        justifyContent: "center",
                                      }}
                                    >
                                      {/* <View style={{alignSelf:'center'}}> */}

                                      <Text
                                        style={{
                                          fontSize: 14,
                                          fontFamily: FontFamily.semi_bold,
                                          marginHorizontal: 7,
                                          alignSelf: "center",
                                        }}
                                      >
                                        {item.boat_name}
                                      </Text>

                                      {/* </View> */}
                                    </View>
                                    <Icon
                                      onPress={() =>
                                        deleteData(item.unavailable_id)
                                      }
                                      name="trash-outline"
                                      type="ionicon"
                                      color={Colors.orange}
                                    />
                                  </View>
                                </View>
                              </Card>
                            </View>
                          );
                        })}
                    </View>
                  ) : (
                    <View style={{ alignItems: "center", marginVertical: 20 }}>
                      <Text
                        style={{
                          fontSize: 20,
                          fontWeight: "bold",
                          color: "#ccc",
                        }}
                      >
                        {I18n.translate("all_boats_available")}
                      </Text>
                    </View>
                  )}
                </View>
              )}
            </View>
          </ScrollView>
        </View>
      </View>
    </View>
  );
};
const mapStateToProps = (state) => ({
  language_id: state.data_Reducer.language_id,
});
export default connect(mapStateToProps)(CalenderView);
const sb = StyleSheet.create({
  SEC2: {
    backgroundColor: Colors.white,
    marginTop: -40,
    borderTopLeftRadius: 30,
    borderTopEndRadius: 30,
    flex: 1,
  },
  btn1: {
    height: 48,
    width: "95%",
    backgroundColor: Colors.orange,
    alignSelf: "center",
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 12,
    marginVertical: 10,
    elevation: 5,
  },
  btn1Text: {
    fontSize: 20,
    fontFamily: FontFamily.semi_bold,
    color: Colors.white,
  },
});
