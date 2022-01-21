import React, { useState } from 'react';
import {
    Text,
    View,
    StyleSheet,
    ImageBackground,
    TouchableOpacity,
    ScrollView,
    FlatList,
    Image
} from 'react-native';
import I18n from '../../Translations/i18'
import AsyncStorage from '@react-native-async-storage/async-storage';
import {
    Icon,
    Input,
    Card
} from 'react-native-elements';
import email from 'react-native-email'
import Header from '../../Components/Header';
import { back_img3, boat_img1, Colors, FontFamily, Sizes } from '../../Constants/Constants';
import { useNavigation } from '@react-navigation/core';

const Settings = () => {
    const navigation = useNavigation()
    const gotoNoti_Settings = () => {
        navigation.navigate("Noti_Setting");
    }
    const gotoChange_Language = () => {
        navigation.navigate("Change_Language")
    }
    const gotoChange_Password = () => {
        navigation.navigate("Change_Password")
    }
    const gotoTerms_Conditions = () => {
        navigation.navigate("Terms_Conditions")
    }
    const gotoEditProfile = () => {
        navigation.navigate("Edit_Profile")
    }
    const handleEmail = () => {
        const to = ['Myboat667@gmail.com'] // string or array of email addresses
        email(to, {
            // Optional additional arguments
            subject: 'Admin Contact',
        }).catch(console.error)
    }
    const logout = async () => {
        await AsyncStorage.clear();
        navigation.reset({
            index: 0,
            routes: [{name: 'Login'}],
          });
    }
    return (
        <View style={{ flex: 1, backgroundColor: Colors.white }}>
            <Header
                backBtn={true}
                name={I18n.translate('settings')} />
            <View style={sb.SEC2}>
                <ScrollView style={{ marginTop: 30 }} showsVerticalScrollIndicator={false}>
                    {/* Account */}
                    <Text style={{ paddingHorizontal: 30, paddingBottom: 5, color: Colors.orange, fontFamily: FontFamily.semi_bold }}>  {I18n.translate('account')}</Text>
                    {/* 1 */}
                    <TouchableOpacity style={{ marginBottom: 1 }} onPress={() => gotoNoti_Settings()}>
                        <Card containerStyle={{ height: 50, paddingVertical: 2, justifyContent: "center", borderRadius: 12 }}>
                            <View style={{ flexDirection: "row", alignItems: "center", justifyContent: "space-between" }}>
                                <View style={{ flexDirection: "row", alignItems: "center" }}>
                                    <Text style={{ fontSize: 14, fontFamily: FontFamily.semi_bold, marginHorizontal: 7 }}>
                                       {I18n.translate('notification_set')}
                                    </Text>
                                </View>
                                <Icon name="arrow-right" type="evilicon" />
                            </View>
                        </Card>
                    </TouchableOpacity>
                    {/*  2*/}
                    <TouchableOpacity 
                            
                    style={{ marginBottom: 1 }} onPress={() => gotoEditProfile()}>
                        <Card containerStyle={{ height: 50, paddingVertical: 2, justifyContent: "center", borderRadius: 12 }}>
                            <View style={{ flexDirection: "row", alignItems: "center", justifyContent: "space-between" }}>
                                <View style={{ flexDirection: "row", alignItems: "center" }}>
                                    <Text style={{ fontSize: 14, fontFamily: FontFamily.semi_bold, marginHorizontal: 7 }}>
                                       {I18n.translate('edit_profile')}
                                    </Text>
                                </View>
                                <Icon name="arrow-right" type="evilicon" />
                            </View>
                        </Card>
                    </TouchableOpacity>
                    {/*  3*/}
                    <TouchableOpacity style={{ marginBottom: 1 }} onPress={() => gotoChange_Password()}>
                        <Card containerStyle={{ height: 50, paddingVertical: 2, justifyContent: "center", borderRadius: 12 }}>
                            <View style={{ flexDirection: "row", alignItems: "center", justifyContent: "space-between" }}>
                                <View style={{ flexDirection: "row", alignItems: "center" }}>
                                    <Text style={{ fontSize: 14, fontFamily: FontFamily.semi_bold, marginHorizontal: 7 }}>
                                        {I18n.translate('change_pass')}
                                    </Text>
                                </View>
                                <Icon name="arrow-right" type="evilicon" />
                            </View>
                        </Card>
                    </TouchableOpacity>
                    {/*  4*/}
                    <TouchableOpacity style={{ marginBottom: 1 }} onPress={() => gotoChange_Language()}>
                        <Card containerStyle={{ height: 50, paddingVertical: 2, justifyContent: "center", borderRadius: 12 }}>
                            <View style={{ flexDirection: "row", alignItems: "center", justifyContent: "space-between" }}>
                                <View style={{ flexDirection: "row", alignItems: "center" }}>
                                    <Text style={{ fontSize: 14, fontFamily: FontFamily.semi_bold, marginHorizontal: 7 }}>
                                    {I18n.translate('change_lang')}
                                    </Text>
                                </View>
                                <Icon name="arrow-right" type="evilicon" />
                            </View>
                        </Card>
                    </TouchableOpacity>
                    {/* Support */}
                    <Text style={{ paddingHorizontal: 30, paddingBottom: 5, paddingTop: 15, color: Colors.orange, fontFamily: FontFamily.semi_bold }}>  {I18n.translate('support')}</Text>
                    {/* 1 */}
                    <TouchableOpacity style={{ marginBottom: 1 }} onPress={() => gotoTerms_Conditions()}>
                        <Card containerStyle={{ height: 50, paddingVertical: 2, justifyContent: "center", borderRadius: 12 }}>
                            <View style={{ flexDirection: "row", alignItems: "center", justifyContent: "space-between" }}>
                                <View style={{ flexDirection: "row", alignItems: "center" }}>
                                    <Text style={{ fontSize: 14, fontFamily: FontFamily.semi_bold, marginHorizontal: 7 }}>
                                    {I18n.translate('terms')}
                                    </Text>
                                </View>
                                <Icon name="arrow-right" type="evilicon" />
                            </View>
                        </Card>
                    </TouchableOpacity>
                    {/* 2 */}
                    <TouchableOpacity style={{ marginBottom: 1 }} onPress={() => navigation.navigate("privacyPolicy")} >
                        <Card containerStyle={{ height: 50, paddingVertical: 2, justifyContent: "center", borderRadius: 12 }}>
                            <View style={{ flexDirection: "row", alignItems: "center", justifyContent: "space-between" }}>
                                <View style={{ flexDirection: "row", alignItems: "center" }}>
                                    <Text style={{ fontSize: 14, fontFamily: FontFamily.semi_bold, marginHorizontal: 7 }}>
                                    {I18n.translate('privacy_policy')}
                                    </Text>
                                </View>
                                <Icon name="arrow-right" type="evilicon" />
                            </View>
                        </Card>
                    </TouchableOpacity>
                    {/* 3 */}
                    <TouchableOpacity style={{ marginBottom: 1 }} onPress={() => navigation.navigate("about")}>
                        <Card containerStyle={{ height: 50, paddingVertical: 2, justifyContent: "center", borderRadius: 12 }}>
                            <View style={{ flexDirection: "row", alignItems: "center", justifyContent: "space-between" }}>
                                <View style={{ flexDirection: "row", alignItems: "center" }}>
                                    <Text style={{ fontSize: 14, fontFamily: FontFamily.semi_bold, marginHorizontal: 7 }}>
                                    {I18n.translate('about')}
                                    </Text>
                                </View>
                                <Icon name="arrow-right" type="evilicon" />
                            </View>
                        </Card>
                    </TouchableOpacity>
                    {/* 4 */}
                    <TouchableOpacity style={{ marginBottom: 1 }} onPress={() => handleEmail()} >
                        <Card containerStyle={{ height: 50, paddingVertical: 2, justifyContent: "center", borderRadius: 12 }}>
                            <View style={{ flexDirection: "row", alignItems: "center", justifyContent: "space-between" }}>
                                <View style={{ flexDirection: "row", alignItems: "center" }}>
                                    <Text style={{ fontSize: 14, fontFamily: FontFamily.semi_bold, marginHorizontal: 7 }}>
                                    {I18n.translate('contact_us')}
                                    </Text>
                                </View>
                                <Icon name="arrow-right" type="evilicon" />
                            </View>
                        </Card>
                    </TouchableOpacity>
                    {/* 5 */}
                    <TouchableOpacity style={{ marginBottom: 1 }}>
                        <Card containerStyle={{ height: 50, paddingVertical: 2, justifyContent: "center", borderRadius: 12 }}>
                            <View style={{ flexDirection: "row", alignItems: "center", justifyContent: "space-between" }}>
                                <View style={{ flexDirection: "row", alignItems: "center" }}>
                                    <Text style={{ fontSize: 14, fontFamily: FontFamily.semi_bold, marginHorizontal: 7 }}>
                                    {I18n.translate('share')}
                                    </Text>
                                </View>
                                <Icon name="arrow-right" type="evilicon" />
                            </View>
                        </Card>
                    </TouchableOpacity>
                    {/* 6 */}
                    <TouchableOpacity style={{ marginBottom: 1 }}>
                        <Card containerStyle={{ height: 50, paddingVertical: 2, justifyContent: "center", borderRadius: 12 }}>
                            <View style={{ flexDirection: "row", alignItems: "center", justifyContent: "space-between" }}>
                                <View style={{ flexDirection: "row", alignItems: "center" }}>
                                    <Text style={{ fontSize: 14, fontFamily: FontFamily.semi_bold, marginHorizontal: 7 }}>
                                    {I18n.translate('rate')}
                                    </Text>
                                </View>
                                <Icon name="arrow-right" type="evilicon" />
                            </View>
                        </Card>
                    </TouchableOpacity>
                    {/* 7 */}
                    <TouchableOpacity onPress={() => logout()} style={{ marginBottom: 15 }}>
                        <Card containerStyle={{ height: 50, paddingVertical: 2, justifyContent: "center", borderRadius: 12 }}>
                            <View style={{ flexDirection: "row", alignItems: "center", justifyContent: "space-between" }}>
                                <View style={{ flexDirection: "row", alignItems: "center" }}>
                                    <Text style={{ fontSize: 14, fontFamily: FontFamily.semi_bold, marginHorizontal: 7 }}>
                                    {I18n.translate('logout')}
                                    </Text>
                                </View>
                                <Icon name="arrow-right" type="evilicon" />
                            </View>
                        </Card>
                    </TouchableOpacity>
                    {/* END */}
                </ScrollView>
            </View>
        </View>
    )
}
const sb = StyleSheet.create({
    SEC2: {
        backgroundColor: Colors.white,
        marginTop: -120,
        borderTopLeftRadius: 30,
        borderTopEndRadius: 30,
        flex: 1
    },
})
export default Settings;