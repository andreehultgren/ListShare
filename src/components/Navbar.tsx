import { Ionicons } from "@expo/vector-icons";
import { AppBar } from "@react-native-material/core";
import { useNavigation } from "@react-navigation/native";
import { INavigation } from "interfaces";
import React from "react";

type Props = {
  title: React.ReactNode;
  subtitle?: React.ReactNode;
  disableGoBack?: boolean;
};

export default function Navbar({ title, subtitle, disableGoBack }: Props) {
  const navigation = useNavigation<INavigation>();
  return (
    <AppBar
      title={title}
      subtitle={subtitle}
      color={"#FFFFFF"}
      style={{ paddingRight: 8, paddingLeft: 8 }}
      leading={
        !!!disableGoBack && navigation.canGoBack() ? (
          <Ionicons
            name="arrow-back"
            size={25}
            onPress={() => navigation.goBack()}
          />
        ) : (
          <></>
        )
      }
      centerTitle
      trailing={
        <Ionicons
          name={"settings"}
          size={20}
          onPress={() => {
            navigation.navigate("Settings");
          }}
        />
      }
    />
  );
}
