import { Image, Text, TouchableOpacity } from "react-native";
import { StyleSheet, View } from "react-native";

export const CardOverLayView = () => {
  return (
    <View
      style={[StyleSheet.absoluteFillObject, { backgroundColor: "black" }]}
    />
  );
};
export const PrimaryImageButton = ({
  text,
  submit,
  src,
  imgDim,
  customStyle,
}) => {
  return (
    <TouchableOpacity
      activeOpacity={0.7}
      onPress={submit}
      style={{
        width: "100%",
        backgroundColor: "white",
        padding: 16,
        borderRadius: 5,
      }}
    >
      <View style={{ flexDirection: "row", gap: 10, alignItems: "center" }}>
        <Image width={15} height={15} style={imgDim} source={src} />
        <Text allowFontScaling={false}>{text}</Text>
      </View>
    </TouchableOpacity>
  );
};

export const HiddenHeaderSettings = {
  headerShown: false,
  cardOverlayEnabled: true,
  cardOverlay: () => {
    return <CardOverLayView />;
  },
};
