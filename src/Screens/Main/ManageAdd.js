import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";
import React, { useEffect, useState } from "react";
import {
  ActivityIndicator,
  FlatList,
  ImageBackground,
  Modal,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { AirbnbRating, Card, Icon, Image } from "react-native-elements";
import { connect } from "react-redux";
import Header from "../../Components/Header";
import { Loading } from "../../Components/Loader";
import config from "../../Constants/config";
import { Colors, FontFamily } from "../../Constants/Constants";
import I18n from "../../Translations/i18";
const ManageAdd = (props) => {
  console.log(props, "props in ManageAdd");
  const [visible, setVisible] = useState(false);
  const [Data, setData] = useState([]);
  const [allData, setAllData] = useState(null);
  const [loader, setLoader] = useState(false);
  const [isFetching, setIsFetching] = useState(false);
  let [prices, setDestinationPrice] = useState([]);
  const [destination, setDestination] = useState([]);
  const [permissionArr, setPermissionArr] = useState([]);
  const [userInfo, setUserInfo] = useState({});
  const [search, setSearch] = useState("");

  // --------------------------------------- //
  const toggleOverlay = ({ item }) => {
    setVisible(!visible);
    setData(item);
  };
  useEffect(async () => {
    const unsubscribe = props.navigation.addListener("focus", () => {
      getLoginuserInfo();
    });
    return unsubscribe;
    let userInfo = await AsyncStorage.getItem("userInfo");
    let parsedInfo = JSON.parse(userInfo);
    getData();
  }, []);
  // const onRefresh = () => {
  //   setIsFetching(true);
  //   getData();
  // };

  const getLoginuserInfo = async () => {
    let userInfo = await AsyncStorage.getItem("userInfo");
    let parsedInfo = JSON.parse(userInfo);
    console.log(parsedInfo, "parsedInfo >>>>>>>>>>>>>");
    setUserInfo(parsedInfo);
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
            res.data.permissions[0].view_add_permission
          ) {
            setPermissionArr(res.data.permissions);
            getData();
          } else {
            alert("You do not have permission to see myadd page.");
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

  const getData = async () => {
    let userInfo = await AsyncStorage.getItem("userInfo");
    let parsedInfo = JSON.parse(userInfo);
    console.log(parsedInfo, "get");
    setLoader(true);
    let url =
      config.apiUrl +
      "/advertisement_list_vender.php?user_id_post=" +
      parsedInfo.id;
    axios
      .get(url)
      .then((res) => {
        console.log(res, "get ads here>>");
        setLoader(false);
        setIsFetching(false);
        if (res.data.success === "true") {
          setAllData(res.data.adver_arr);

          if (allData !== "NA" && allData?.length) {
            allData.map((item, index) => {
              getDestinations(item, index, true);
            });
          }
        } else {
          if (res?.data?.status_code == 405) {
            logout();
          }
          if (props.language_id == 0) alert(res.data.msg[0]);
          else alert(res.data.msg[1]);
        }
      })
      .catch((err) => console.log(err));
  };
  const deleteAd = async (advertisementId) => {
    let userInfo = await AsyncStorage.getItem("userInfo");
    let parsedInfo = JSON.parse(userInfo);
    // const url =
    //   "https://freshandfine.xyz/app/webservice/advertisement_delete.php?user_id_post=" +
    //   parsedInfo.id +
    //   "&&advertisement_id_post=" +
    //   advertisementId;

    let url =
      config.apiUrl +
      "/advertisement_delete.php?user_id_post=" +
      parsedInfo.id +
      "&advertisement_id_post=" +
      advertisementId;

    axios
      .get(url)
      .then((res) => {
        if (res.data.success === "true") {
          getData();
          setVisible(false);
        } else {
          setVisible(false);
          if (props.language_id == 0) alert(res.data.msg[0]);
          else alert(res.data.msg[1]);
        }
      })
      .catch((err) => console.log(err));
  };
  const loadAdDetails = async (ad_id) => {
    setLoader(true);
    let userInfo = await AsyncStorage.getItem("userInfo");
    let parsedInfo = JSON.parse(userInfo);
    let url =
      config.apiUrl +
      "/advertisement_details.php?user_id_post=" +
      parsedInfo.id +
      "&advertisement_id=" +
      ad_id;
    axios
      .get(url)
      .then((res) => {
        console.log(res, "get all ads");
        setLoader(false);
        if (res) {
          setData(res.data.adver_arr);
          let data = {
            edit: true,
            adver_boat_type: Data.adver_boat_type,
            captain_ar: Data.captain_ar,
            captain_en: Data.captain_eng,
            trip_type_id: Data.trip_type_id,
            mobile: Data.mobile,
            trip_type_id: Data.trip_type_id,
            boat_id: Data.boat_id,
            no_of_people: res.data.adver_arr.remaining_seats,
            location_lng: Data.location_lng,
            location_lat: Data.location_lat,
            location_address: Data.location_address,
            discription_ar: Data.discription_ar,
            discription_en: Data.discription_en,
            extra_price: Data.extra_price,
            trip_time_type: Data.trip_time_type,
            minimum_hours: Data.minimum_hours,
            idle_time: Data.idle_time,
            img_arr: Data.img_arr,
            image: Data.image,
            discount: Data.discount,
            coupon_code: res.data.adver_arr.coupon_code,
            coupon_discount: res.data.adver_arr.coupon_discount,
            city_get: res.data.adver_arr.city_get,
            city_name: res.data.adver_arr.city_name[0],
            addon_arr: JSON.parse(JSON.stringify(res.data.adver_arr.addon_arr)),
            destination_arr: JSON.parse(
              JSON.stringify(res.data.adver_arr.destination_arr)
            ),
            free_cancel_days: res.data.adver_arr.free_cancel_days,
            advertisement_id: Data.advertisement_id,
          };
          if (Data.trip_time_type === 1) {
            data.trip_time_end = Data.trip_time_end;
            data.trip_time_start = Data.trip_time_start;
          } else {
            data.trip_time_start = Data.trip_time_start;
          }
          console.log(data, "sending it>>>>");
          props.navigation.navigate("AddAd", data);
        } else {
          if (props.language_id == 0) alert(res.data.msg[0]);
          else alert(res.data.msg[1]);
        }
      })
      .catch((err) => {
        setLoader(false);
      });
  };
  const getDestinations = (item, index, update) => {
    let destinations = "";
    let destinationPrices = "";
    if (
      item.destination_arr &&
      item.destination_arr.length &&
      item.destination_arr !== "NA"
    ) {
      item.destination_arr.map((innerItem, index) => {
        if (index === item.destination_arr.length - 1) {
          // destinations += props.language_id == 0? innerItem?.destination[0]:innerItem?.destination[1];
          destinationPrices += Math.trunc(innerItem?.price);
        } else {
          // destinations +=props.language_id == 0?  innerItem?.destination[0]:innerItem?.destination[1] + ',';
          destinationPrices += Math.trunc(innerItem?.price) + ",";
        }
      });
    }
    let destinationPricesArr = destinationPrices.split(",");
    let destinationArr = destinations.split(",");
    destinationPricesArr = destinationPricesArr.map((item) => parseInt(item));

    let price = destinationPricesArr[0];
    destinationPricesArr.filter((item) => {
      if (item < price) price = item;
    });

    let lowestIndex = 0;
    destinationPricesArr.map((item, index) => {
      if (item == price) lowestIndex = index;
    });
    let destination;
    if (item && item.destination_arr !== "NA") {
      destination =
        props.language_id == 0
          ? item.destination_arr[lowestIndex].destination[0]
          : item.destination_arr[lowestIndex].destination[1];
      prices[index] = price;
    }

    if (update) {
      setDestinationPrice(prices);
      setDestination(destination);
      return;
    }
    return destination;
  };

  //filter search
  const searchByKeyword = async (text) => {
    console.log(text, "text by searching");
    setSearch(text);
    // if (text && text.length > 0) {
    let userInfo = await AsyncStorage.getItem("userInfo");
    let parsedInfo = JSON.parse(userInfo);
    console.log(parsedInfo, "get");
    setLoader(true);
    let url =
      config.apiUrl +
      "/advertisement_list_vender.php?user_id_post=" +
      parsedInfo.id +
      "&adver_keyword=" +
      text;
    axios
      .get(url)
      .then((res) => {
        console.log(res, "after search");
        setLoader(false);
        if (res.data.success === "true") {
          setAllData(res.data.adver_arr);

          if (allData !== "NA" && allData?.length) {
            allData.map((item, index) => {
              getDestinations(item, index, true);
            });
          }
        } else {
          if (props.language_id == 0) alert(res.data.msg[0]);
          else alert(res.data.msg[1]);
        }
      })
      .catch((err) => console.log(err));
    // }
  };

  return (
    <View style={{ backgroundColor: Colors.white, flex: 1 }}>
      <Header
        // backBtn={props?.route.params?.notificationParam ? true : false}
        name={I18n.translate("manage_ad")}
        searchBtn={true}
        imgBack={true}
        isarbic={props.language_id == 1 ? 1 : 0}
      />

      {/* Buttons */}
      <View style={s.btn_1}>
        <TouchableOpacity
          style={[s.btn1]}
          onPress={() => {
            (permissionArr &&
              permissionArr.length > 0 &&
              permissionArr[0].manage_add_permission === 1) ||
            (userInfo && userInfo.role_id == 1)
              ? props.navigation.navigate("AddAd")
              : alert("No permission granted to check this.");
          }}
          activeOpacity={0.8}
        >
          <Text style={[s.btn1Text]}>{I18n.translate("add_ad")}</Text>
        </TouchableOpacity>
      </View>

      <TextInput
        onChangeText={(search) => searchByKeyword(search)}
        value={search}
        placeholder="Search here..."
        style={s.searchStyle}
      />
      {/* View */}
      <View style={s.SEC2}>
        {loader ? (
          <Loading />
        ) : (
          <View>
            {allData === "NA" ? (
              <View style={{ alignItems: "center", marginTop: "10%" }}>
                <Text
                  style={{ fontSize: 20, fontWeight: "bold", color: "#ccc" }}
                >
                  {I18n.translate("no_data")}
                </Text>
              </View>
            ) : (
              <FlatList
                data={allData === "NA" ? [] : allData}
                showsVerticalScrollIndicator={false}
                refreshing={isFetching}
                // onRefresh={onRefresh}
                renderItem={({ item, index }) => {
                  return (
                    <TouchableOpacity
                      activeOpacity={0.7}
                      onPress={() => {
                        props.navigation.navigate("viewAddDetail", {
                          item: allData[index],
                          // addvr_id:Data.advertisement_id
                        });
                      }}
                      style={{ padding: 5 }}
                    >
                      <Card
                        containerStyle={{
                          padding: 0,
                          borderRadius: 15,
                          paddingHorizontal: 0,
                          margin: 7.5,
                          marginHorizontal: 10,
                          elevation: 5,
                        }}
                      >
                        <ImageBackground
                          style={s.ImageBackground}
                          imageStyle={s.imgStyle}
                          source={{
                            uri:
                              item.image !== "NA"
                                ? config.imageUrl + item.image
                                : "https://media.istockphoto.com/vectors/no-image-available-sign-vector-id922962354?k=20&m=922962354&s=612x612&w=0&h=f-9tPXlFXtz9vg_-WonCXKCdBuPUevOBkp3DQ-i0xqo=",
                          }}
                        >
                          {Math.trunc(item.discount) > 0 && (
                            <View
                              style={[
                                {
                                  justifyContent: "center",
                                  transform: [
                                    {
                                      rotate:
                                        props.language_id == 0
                                          ? "-45deg"
                                          : "45deg",
                                    },
                                  ],
                                },
                                s.trapezoid_discount,
                              ]}
                            >
                              <Text
                                style={{
                                  position: "absolute",
                                  fontFamily: FontFamily.semi_bold,
                                  fontSize: 11,
                                  alignSelf: "center",
                                  color: Colors.white,
                                }}
                              >
                                {Math.trunc(item.discount)} %{" "}
                                {I18n.translate("off")}
                              </Text>
                            </View>
                          )}
                          <TouchableOpacity
                            style={{
                              position: "absolute",
                              right: 10,
                              top: 10,
                              borderRadius: 20,
                              backgroundColor: Colors.orange,
                            }}
                            onPress={() => toggleOverlay({ item })}
                          >
                            <Icon
                              name="dots-three-vertical"
                              type="entypo"
                              color={Colors.white}
                            />
                          </TouchableOpacity>
                          <View
                            style={[
                              {
                                height: 40,
                                //  width:97,
                                backgroundColor: Colors.white,
                                flexDirection: "row",
                                alignItems: "center",
                                justifyContent: "space-around",
                                position: "absolute",
                                right: 20,
                                bottom: -1,
                                paddingHorizontal: 10,
                                borderTopLeftRadius: 12,
                                borderTopRightRadius: 12,
                              },
                            ]}
                          >
                            <Text style={s.place}>
                              {I18n.translate("kwd")} {prices[index]}
                            </Text>
                          </View>
                        </ImageBackground>
                        <View style={s.SEC3}>
                          <View style={{}}>
                            <Text style={s.title}>{item.boat_name}</Text>
                            <View
                              style={{
                                flexDirection: "row",
                                alignItems: "center",
                                marginTop: 5,
                                justifyContent: "center",
                                alignContent: "center",
                              }}
                            >
                              <View style={{ justifyContent: "center" }}>
                                <Image
                                  style={{
                                    height: 40,
                                    width: 40,
                                    borderRadius: 20,
                                    resizeMode: "cover",
                                  }}
                                  source={{
                                    uri: config.imageUrl + userInfo.image,
                                  }}
                                  PlaceholderContent={
                                    <ActivityIndicator
                                      size={30}
                                      color={Colors.orange}
                                      style={{ alignSelf: "center" }}
                                    />
                                  }
                                />
                              </View>
                              <View style={{ marginHorizontal: 15 }}>
                                <Text
                                  style={{
                                    color: "#000",
                                    fontSize: 14,
                                    fontFamily: FontFamily.default,
                                  }}
                                >
                                  {item.boat_brand}
                                </Text>

                                {item && item.rating ? (
                                  <AirbnbRating
                                    showRating={false}
                                    size={12}
                                    isDisabled
                                    defaultRating={item.rating}
                                  />
                                ) : (
                                  <AirbnbRating
                                    showRating={false}
                                    size={12}
                                    isDisabled
                                    defaultRating={0}
                                  />
                                )}
                              </View>
                            </View>
                          </View>
                          <View>
                            {/* <Text
                              style={{
                                color: 'rgba(51, 51, 51, 1)',
                                fontSize: 12,
                                fontFamily: FontFamily.default,
                              }}>
                              {I18n.translate('destination')}
                              {`: ${getDestinations(item, index)}`}
                            </Text> */}
                            <View
                              style={{
                                // flexDirection: "row",
                                alignItems: "center",
                                alignSelf: "flex-end",
                              }}
                            >
                              <Icon name="person" size={14} />
                              <Text
                                style={{
                                  color: "rgba(51, 51, 51, 1)",
                                  fontSize: 10,
                                  fontFamily: FontFamily.default,
                                }}
                              >
                                {item.no_of_people} {I18n.translate("person")}
                              </Text>
                              {item.adver_boat_type != 1 && (
                                <Text
                                  style={{
                                    color: "rgba(51, 51, 51, 1)",
                                    fontSize: 10,
                                    fontFamily: FontFamily.default,
                                  }}
                                >
                                  {item.remaining_seats}{" "}
                                  {I18n.translate("Remaning")}
                                </Text>
                              )}
                            </View>
                            {/* <Text
                              style={{
                                alignSelf: 'flex-end',
                                color: 'rgba(51, 51, 51, 1)',
                                fontSize: 10,
                                fontFamily: FontFamily.default,
                              }}>
                              {I18n.translate('pickup')}
                              {`: ${
                                props.language_id == 0
                                  ? item.city[0].name
                                  : item.city[0].name_ar
                              }`}
                            </Text> */}
                          </View>
                        </View>
                      </Card>
                    </TouchableOpacity>
                  );
                }}
                keyExtractor={(i, ind) => ind}
                style={{
                  marginTop: 30,
                }}
                contentInsetAdjustmentBehavior="automatic"
                contentContainerStyle={{
                  paddingBottom: 10,
                  //    height:"100%"
                }}
              />
            )}
          </View>
        )}
      </View>
      {/* Overlay */}
      <Modal
        animationType={"none"}
        transparent={true}
        visible={visible}
        onBackdropPress={toggleOverlay}
        overlayStyle={{ borderRadius: 20 }}
        onRequestClose={() => {}}
      >
        <View
          style={{
            height: "100%",
            alignItems: "center",
            justifyContent: "center",
            backgroundColor: "#ffffff25",
          }}
        >
          <View
            style={{
              width: 300,
              justifyContent: "center",
              elevation: 1,
              shadowOffset: { width: 0, height: 1 },
              shadowOpacity: 1,
              borderRadius: 20,
              backgroundColor: "white",
              alignItems: "center",
            }}
          >
            <TouchableOpacity
              onPress={() => {
                setVisible(false);
                loadAdDetails(Data.advertisement_id);
              }}
            >
              <Text
                style={{
                  fontFamily: FontFamily.semi_bold,
                  fontSize: 16,
                  lineHeight: 40,
                  color: "rgba(0, 0, 0, 0.55)",
                }}
              >
                {I18n.translate("edit")}
              </Text>
            </TouchableOpacity>

            <View
              style={{
                width: "100%",
                borderWidth: 0.5,
                marginTop: 5,
                borderColor: "rgba(0, 0, 0, 0.55)",
                backgroundColor: "rgba(0, 0, 0, 0.55)",
              }}
            />
            <TouchableOpacity
              onPress={() => {
                deleteAd(Data.advertisement_id);
              }}
            >
              <Text
                style={{
                  fontFamily: FontFamily.semi_bold,
                  fontSize: 16,
                  lineHeight: 39,
                  color: "rgba(0, 0, 0, 0.55)",
                }}
              >
                {I18n.translate("delete")}
              </Text>
            </TouchableOpacity>
            <View
              style={{
                width: "100%",
                borderWidth: 0.5,
                marginTop: 5,
                borderColor: "rgba(0, 0, 0, 0.55)",
                backgroundColor: "rgba(0, 0, 0, 0.55)",
              }}
            />
            <TouchableOpacity
              onPress={() => toggleOverlay({ item: undefined })}
            >
              <Text
                style={{
                  fontFamily: FontFamily.semi_bold,
                  fontSize: 16,
                  lineHeight: 39,
                  color: "rgba(0, 0, 0, 0.55)",
                }}
              >
                {I18n.translate("back")}
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
};
const mapStateToProps = (state) => ({
  language_id: state.data_Reducer.language_id,
  permissions: state.data_Reducer.permissions,
});

export default connect(mapStateToProps)(ManageAdd);
const s = StyleSheet.create({
  btn1: {
    height: 35,
    width: 240,
    alignSelf: "center",
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 7,
    marginBottom: 20,
    elevation: 5,
    backgroundColor: Colors.orange,
  },
  btn1Text: {
    fontSize: 12,
    fontFamily: FontFamily.semi_bold,
    color: Colors.white,
  },
  btn_1: {
    flexDirection: "row",
    justifyContent: "space-around",
    position: "absolute",
    alignSelf: "center",
    top: 110,
  },
  SEC2: {
    backgroundColor: Colors.white,
    marginTop: -40,
    borderTopLeftRadius: 30,
    borderTopEndRadius: 30,
    flex: 1,
  },
  ImageBackground: {
    height: 215,
    width: "100%",
    borderRadius: 15,
    alignSelf: "center",
    // marginHorizontal:10,
    elevation: 0,
  },
  imgStyle: {
    borderRadius: 15,
    height: 215,
    width: "100%",
    alignSelf: "center",
  },
  SEC3: {
    flexDirection: "row",
    justifyContent: "space-between",
    padding: 10,
    paddingHorizontal: 20,
    alignItems: "center",
  },
  title: {
    fontFamily: FontFamily.semi_bold,
    fontSize: 18,
    color: Colors.orange,
    // lineHeight:20
  },
  type: {
    fontFamily: FontFamily.default,
    fontSize: 15,
    lineHeight: 20,
    color: Colors.black1,
  },
  no: {
    fontFamily: FontFamily.default,
    fontSize: 12,
    lineHeight: 20,
    color: Colors.black1,
  },
  dis: {
    fontFamily: FontFamily.default,
    fontSize: 13,
    color: Colors.black1,
  },
  place: {
    fontFamily: FontFamily.default,
    fontSize: 16,
    color: Colors.orange,
  },
  trapezoid_discount: {
    width: 115,
    height: 0,
    borderBottomWidth: 25,
    borderBottomColor: Colors.orange,
    borderLeftWidth: 25,
    borderLeftColor: "transparent",
    borderRightWidth: 25,
    borderRightColor: "transparent",
    borderStyle: "solid",
    backgroundColor: "transparent",
    alignItems: "center",
    marginTop: 19.2,
    marginLeft: -26,
  },
  searchStyle: {
    margin: 15,
    width: "90%",
    height: 35,
    position: "absolute",
    top: 58,
    left: 10,
    backgroundColor: "white",
    paddingHorizontal: 10,
    borderRadius: 10,
  },
});
