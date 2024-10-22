import { StyleSheet, View, SafeAreaView, ImageBackground, Text } from "react-native";
import React from "react";
import { useAuth } from "../../context/Auth";
export default function Home() {
  
  const styles = createStyles();
  const { login } = useAuth();
  return (
    <>
      <View style={{flex:1, justifyContent:"center", alignItems:"center", backgroundColor:"black" }}>
        <Text
          allowFontScaling={false}          
          style={styles.headerText}
        >
         Congratulations you are authorized
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
