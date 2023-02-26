import React from "react";
import { Text } from "react-native";
import { INavigation } from "interfaces";

interface IProps {
  navigation: INavigation;
}

export default function ({ navigation }: IProps) {
  return <Text>Hello world</Text>;
}
