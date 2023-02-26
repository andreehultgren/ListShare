import React, { useState } from "react";
import { View, Platform, Pressable } from "react-native";
import { Button } from "@react-native-material/core";
import { Ionicons } from "@expo/vector-icons";
import { INavigation } from "interfaces";
import { useName } from "../hooks/useName";
import {
  Stack,
  Text,
  Surface,
  IconButton,
  TextInput,
} from "@react-native-material/core";
import Dialog from "react-native-dialog";
import Navbar from "../components/Navbar";
import { useListKeys } from "../hooks/useListKeys";
import ListItem from "../components/ListItem";
import {
  GestureHandlerRootView,
  Swipeable,
} from "react-native-gesture-handler";

interface IProps {
  navigation: INavigation;
}

function isEmailValid(email: string) {
  const regex =
    /(?:[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*|"(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21\x23-\x5b\x5d-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])*")@(?:(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?|\[(?:(?:(2(5[0-5]|[0-4][0-9])|1[0-9][0-9]|[1-9]?[0-9]))\.){3}(?:(2(5[0-5]|[0-4][0-9])|1[0-9][0-9]|[1-9]?[0-9])|[a-z0-9-]*[a-z0-9]:(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21-\x5a\x53-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])+)\])/;
  return regex.test(email);
}

export default function ({ navigation }: IProps) {
  const [name, setName] = useName();
  const [shareKey, setShareKey] = useState<string>("");
  const [newName, setNewName] = useState<string>("");
  const [shareEmail, setShareEmail] = useState<string>("");
  const [listKeys, createList, shareList, deleteList] = useListKeys();
  const [newListName, setNewListName] = useState<string>("");
  const [dialogVisible, showDialog] = useState<boolean>(false);
  const isWeb = Platform.OS === "web";

  return (
    <GestureHandlerRootView style={{ height: "100%" }}>
      <Stack h="100%">
        <Navbar
          title={`Welcome ${!!name ? name : ""}`}
          subtitle="What's poppin?"
          disableGoBack
        />
        <View
          style={{
            margin: 16,
          }}
        >
          <Text style={{ fontSize: 12, marginBottom: 8, marginLeft: 12 }}>
            Active lists
          </Text>
          <Stack spacing={8}>
            {listKeys.length === 0 ? (
              <Surface style={{ padding: 16, borderRadius: 8 }}>
                <Text>
                  There are no lists. Press here to create your first list
                </Text>
                <Button
                  style={{ marginTop: 16 }}
                  title="Add your first list"
                  color="green"
                  onPress={() => showDialog(true)}
                />
              </Surface>
            ) : (
              <></>
            )}
            {listKeys.map((listKey) => (
              <View
                key={listKey}
                style={{ borderRadius: 16, overflow: "hidden" }}
              >
                <Swipeable
                  renderRightActions={() => (
                    <Pressable
                      onPress={() => deleteList(listKey)}
                      style={{
                        backgroundColor: "red",
                        padding: 16,
                        borderTopRightRadius: 8,
                        borderBottomRightRadius: 8,
                        display: "flex",
                        justifyContent: "center",
                      }}
                    >
                      <Text style={{ color: "white" }}>Delete</Text>
                    </Pressable>
                  )}
                  renderLeftActions={() => (
                    <Pressable
                      onPress={() => setShareKey(listKey)}
                      style={{
                        borderTopLeftRadius: 8,
                        borderBottomLeftRadius: 8,
                        backgroundColor: "blue",
                        padding: 16,
                        display: "flex",
                        justifyContent: "center",
                      }}
                    >
                      <Text style={{ color: "white" }}>Share</Text>
                    </Pressable>
                  )}
                >
                  <ListItem listKey={listKey} />
                </Swipeable>
              </View>
            ))}
          </Stack>
        </View>
        <IconButton
          style={{
            backgroundColor: "#448844",
            position: "absolute",
            right: 15,
            bottom: 15,
          }}
          onPress={() => showDialog(true)}
          icon={<Ionicons name="add" size={30} color="white" />}
        />
        <Stack
          h="100%"
          style={{
            display: dialogVisible ? "flex" : "none",
            position: "absolute",
            zIndex: 100,
            width: "100%",
            height: "100%",
            backgroundColor: "rgba(0,0,0,0.5)",
          }}
          justify="center"
        >
          <Surface style={{ padding: 16, margin: 32, borderRadius: 12 }}>
            <Stack spacing={8}>
              <Text style={{ fontSize: 20 }}>Create new list</Text>
              <Text>What do you want to call the new list?</Text>
              <TextInput value={newListName} onChangeText={setNewListName} />
              <Button
                title="Cancel"
                color="red"
                onPress={() => {
                  showDialog(false);
                  setNewListName("");
                }}
              />
              <Button
                title="Create"
                color="green"
                onPress={() => {
                  // Create the list
                  createList(newListName).then((listKey) => {
                    showDialog(false);
                    setNewListName("");
                    navigation.navigate("ShoppingList", { listKey });
                  });
                  // Redirect the user
                }}
              />
            </Stack>
          </Surface>
        </Stack>

        <Stack
          h="100%"
          style={{
            display: name === undefined ? "flex" : "none",
            position: "absolute",
            zIndex: 100,
            width: "100%",
            height: "100%",
            backgroundColor: "rgba(0,0,0,0.5)",
          }}
          justify="center"
        >
          <Surface style={{ padding: 16, margin: 32, borderRadius: 12 }}>
            <Stack spacing={8}>
              <Text style={{ fontSize: 20 }}>Let's get you started</Text>
              <Text>Select your name</Text>
              <TextInput value={newName} onChangeText={setNewName} />
              <Button
                title="Save"
                color="green"
                disabled={newName.length < 3}
                onPress={() => {
                  setName(newName);
                }}
              />
            </Stack>
          </Surface>
        </Stack>

        <Stack
          h="100%"
          style={{
            display: !!shareKey ? "flex" : "none",
            position: "absolute",
            zIndex: 100,
            width: "100%",
            height: "100%",
            backgroundColor: "rgba(0,0,0,0.5)",
          }}
          justify="center"
        >
          <Surface style={{ padding: 16, margin: 32, borderRadius: 12 }}>
            <Stack spacing={8}>
              <Text style={{ fontSize: 20 }}>Share this list</Text>
              <Text>Who do you want to share the list with?</Text>
              <TextInput value={shareEmail} onChangeText={setShareEmail} />
              <Button
                title="Cancel"
                color="red"
                onPress={() => {
                  setShareKey("");
                }}
              />
              <Button
                title="Share"
                color={isEmailValid(shareEmail) ? "blue" : "grey"}
                disabled={!isEmailValid(shareEmail)}
                onPress={() => {
                  shareList(shareKey, shareEmail).then(() => setShareKey(""));
                }}
              />
            </Stack>
          </Surface>
        </Stack>
      </Stack>
    </GestureHandlerRootView>
  );
}
