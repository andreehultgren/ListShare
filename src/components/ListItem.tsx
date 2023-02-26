import { useList } from "../hooks/useList";
import React from "react";
import { Pressable, Text, View } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { INavigation } from "interfaces";

type Props = {
  listKey: string;
};

export default function ListItem({ listKey }: Props) {
  const navigation = useNavigation<INavigation>();
  const [list, setName, setList] = useList(listKey);
  if (!!!list) {
    return <></>;
  }
  return (
    <Pressable onPress={() => navigation.navigate("ShoppingList", { listKey })}>
      <View
        key={listKey}
        style={{
          paddingVertical: 20,
          paddingHorizontal: 20,
          backgroundColor: "#448844",
        }}
      >
        <Text
          style={{
            fontSize: 16,
            color: "#FFFFFF",
          }}
        >
          {list.name}
        </Text>
        <Text
          style={{
            fontSize: 12,
            marginTop: 4,
            color: "#FFFFFF",
          }}
        >
          There {list?.items?.length > 1 ? "are" : "is"} {list?.items?.length}{" "}
          item
          {list?.items?.length > 1 ? "s" : ""} in this list
        </Text>
      </View>
    </Pressable>
  );
}
