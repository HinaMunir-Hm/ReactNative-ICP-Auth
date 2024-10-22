import { StyleSheet, View, SafeAreaView, ImageBackground, Text } from "react-native";
import React from "react";
import internetIdLogo from "../../assets/images/internetIdentity.png";
import nfid from "../../assets/images/nfid.png";
import { useAuth } from "../../context/Auth";
import { PrimaryImageButton } from "../../components/reuseable";
export default function Authentication() {
  
  const styles = createStyles();
  const { login } = useAuth();
  return (
    <>
      <View style={{flex:1, justifyContent:"center", alignItems:"center", backgroundColor:"black" }}>
        <Text
          allowFontScaling={false}          
          style={styles.headerText}
        >
          Create your account
        </Text>
        
        <View
          style={{
            display: "flex",
            gap: 10,
            marginVertical: 20,
            marginBottom: 30,
          }}
        >
          <PrimaryImageButton
            imgDim={{ width: 30, height: 10 }}
            src={internetIdLogo}
            text="Continue with Internet Identity"
            customStyle={{ fontSize: 14 }}
            submit={() => {
              login("internetIdentity");
            }}
          />
          <Text
            allowFontScaling={false}
            variant="SatoshiMedium"
            style={[styles.subText, { textAlign: "center" }]}
          >
            Or
          </Text>
          <PrimaryImageButton
            customStyle={{ fontSize: 14 }}
            imgDim={{ width: 45, height: 20 }}
            src={nfid}
            text="Continue with NFID (Legacy)"
            submit={() => {
              login("nfid");
              // rootNavigate("userName")
            }}
          />
        </View>
        <Text
          allowFontScaling={false}          
          style={styles.desc}
        >
          By signing up, you agree to our Terms,Privacy Policy, and
          {"\n"}
          Cookie Use.
        </Text>
      </View>
    </>
  );
}

const createStyles = (props) =>
  StyleSheet.create({
    subContainer: {
      padding: 20,
      borderRadius: 10,
      marginTop: -70,
    },
    headerText: {
      fontSize: 20,
      color: "white",
      textAlign: "left",
    },
    subText: {
      fontSize: 12,
      color: "white",
      textAlign: "left",
    },
    desc: {
      fontSize: 10,
      color: "white",
      textAlign: "center",
    },
  });
