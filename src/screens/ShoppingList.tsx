import React, { useState, useEffect } from "react";
import { INavigation } from "interfaces";
import {
  Stack,
  Text,
  Surface,
  TextInput,
  IconButton,
  Flex,
  Spacer,
  Button,
} from "@react-native-material/core";

import Navbar from "../components/Navbar";
import { Ionicons } from "@expo/vector-icons";
import { Modal, Pressable, View } from "react-native";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import Swipeable from "react-native-gesture-handler/Swipeable";
import { useList } from "../hooks/useList";

interface IProps {
  navigation: INavigation;
  route: any;
}

interface IItem {
  name: string;
  quantity: string;
  done: boolean;
}

export default function ({ navigation, route }: IProps) {
  const params = route.params;
  const [listName, setListName] = useState<string>("");
  const currentListKey = params.listKey;
  const [list, saveListName, setItems] = useList(currentListKey);
  const items = list?.items ?? [];
  const [newItemName, setNewItemName] = useState<string>("");
  const [newItemQuantity, setNewItemQuantity] = useState<string>("");
  const [updateIndex, setUpdateIndex] = useState<null | number>(null);
  const [modalVisible, setModalVisible] = useState<boolean>(false);

  useEffect(() => {
    if (!!list?.name) {
      setListName(list.name);
    }
  }, [list?.name]);

  if (!!!list) {
    return <Text>Loading</Text>;
  }

  function saveNewItem() {
    let newData = { name: newItemName, quantity: newItemQuantity, done: false };
    let newItems = [...items];
    if (updateIndex !== null) {
      newItems[updateIndex] = newData;
    } else {
      newItems.push(newData);
    }
    setItems(newItems);
    closeModal();
  }

  function toggleItem(index: number) {
    let newItems = [...items];
    newItems[index].done = !newItems[index].done;
    setItems(newItems);
  }

  function deleteItem(index: number) {
    let newItems = items.filter((item, itemIndex) => itemIndex !== index);
    setItems(newItems);
  }

  function editItem(index: number) {
    setNewItemName(items[index].name);
    setNewItemQuantity(items[index].quantity);
    setUpdateIndex(index);
    setModalVisible(true);
  }

  function closeModal() {
    setUpdateIndex(null);
    setNewItemName("");
    setNewItemQuantity("");
    setModalVisible(false);
  }

  return (
    <GestureHandlerRootView>
      <Stack h="100%">
        <Navbar title="Shopping List" subtitle={listName} />
        <Surface
          key="welcome"
          elevation={2}
          style={{ padding: 16, zIndex: modalVisible ? 1 : 3 }}
        >
          <TextInput
            color="blue"
            style={{ marginTop: 12 }}
            label="List name"
            variant="standard"
            placeholder="What do you want the list to be called?"
            value={listName}
            onChangeText={(text) => {
              setListName(text);
              saveListName(text);
            }}
          />
        </Surface>
        <Flex fill style={{ zIndex: modalVisible ? 1 : 3 }}>
          <Stack style={{ paddingHorizontal: 16, paddingVertical: 16 }}>
            {items.length === 0 ? (
              <Surface style={{ padding: 16, borderRadius: 8 }}>
                <Text>There are no items in this list yet</Text>
                <Button
                  color="green"
                  title="Add your first item"
                  onPress={() => setModalVisible(true)}
                />
              </Surface>
            ) : (
              <>
                <Stack
                  justify="between"
                  direction="row"
                  style={{
                    paddingHorizontal: 8,
                    borderRadius: 8,
                    paddingBottom: 8,
                  }}
                >
                  <Text>Name</Text>
                  <Text>Amount</Text>
                </Stack>
                {items.map((item, index) => (
                  <Swipeable
                    key={index}
                    renderRightActions={() => (
                      <Pressable
                        onPress={() => deleteItem(index)}
                        style={{
                          backgroundColor: "red",
                          padding: 16,
                          borderTopRightRadius: 8,
                          borderBottomRightRadius: 8,
                        }}
                      >
                        <Text style={{ color: "white" }}>Delete</Text>
                      </Pressable>
                    )}
                    renderLeftActions={() => (
                      <Pressable
                        onPress={() => editItem(index)}
                        style={{
                          borderTopLeftRadius: 8,
                          borderBottomLeftRadius: 8,
                          backgroundColor: "#F7B011",
                          padding: 16,
                        }}
                      >
                        <Text style={{ color: "white" }}>Edit</Text>
                      </Pressable>
                    )}
                  >
                    <Pressable onPress={() => toggleItem(index)}>
                      <Surface
                        style={{
                          padding: 16,
                          borderRadius: 8,
                          backgroundColor: item.done ? "#DADADA" : "#FFFFFF",
                        }}
                      >
                        <Stack justify="between" direction="row">
                          <Text>{item.name}</Text>
                          <Text>{item.quantity}</Text>
                        </Stack>
                      </Surface>
                    </Pressable>
                  </Swipeable>
                ))}
              </>
            )}
          </Stack>
          <Spacer />
          <Stack direction="row" justify="end" style={{ padding: 16 }}>
            <IconButton
              style={{
                backgroundColor: "#448844",
              }}
              onPress={() => setModalVisible(true)}
              icon={<Ionicons name="add" size={30} color="white" />}
            />
          </Stack>
        </Flex>
        <View
          style={{
            height: "100%",
            width: "100%",
            position: "absolute",
            top: 0,
            left: 0,
            backgroundColor: modalVisible ? "rgba(0,0,0,0.5)" : undefined,
            zIndex: 2,
          }}
        />
        <Modal
          animationType="slide"
          transparent={true}
          onDismiss={closeModal}
          visible={modalVisible}
          onRequestClose={closeModal}
          style={{ zIndex: 3 }}
        >
          <Stack h="100%" justify="end">
            <Pressable style={{ flex: 1 }} onPress={closeModal} />
            <Stack
              style={{
                backgroundColor: "#FFFFFF",
                borderTopLeftRadius: 30,
                borderTopRightRadius: 30,
                padding: 30,
              }}
              spacing={32}
            >
              <Text>Add new item to the list</Text>
              <TextInput
                onSubmitEditing={() => {
                  if (newItemName.length > 0 && newItemQuantity.length > 0) {
                    saveNewItem();
                  }
                }}
                label="Name of item"
                variant="standard"
                value={newItemName}
                onChangeText={setNewItemName}
              />
              <TextInput
                onSubmitEditing={() => {
                  if (newItemName.length > 0 && newItemQuantity.length > 0) {
                    saveNewItem();
                  }
                }}
                variant="standard"
                label="Quantity"
                value={newItemQuantity}
                onChangeText={setNewItemQuantity}
              />
              <Button
                title="Save"
                color="green"
                disabled={
                  newItemName.length === 0 || newItemQuantity.length === 0
                }
                onPress={saveNewItem}
              />
            </Stack>
          </Stack>
        </Modal>
      </Stack>
    </GestureHandlerRootView>
  );
}
