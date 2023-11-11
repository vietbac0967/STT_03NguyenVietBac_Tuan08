import {
  StyleSheet,
  Text,
  View,
  Pressable,
  TextInput,
  FlatList,
} from "react-native";
import React, { useState, useEffect } from "react";
import Button from "../components/Button";

export default function HomeScreen({ navigation, route }) {
  const user = route.params.user;
  const [data, setData] = useState([]);
  const [task, setTask] = useState("");
  const [editIndex, setEditIndex] = useState(-1);
  const apiUrl = "https://653f4b7b9e8bd3be29e02fc1.mockapi.io/users";
  useEffect(() => {
    fetch(`${apiUrl}/${user.id}/tasks`)
      .then((response) => response.json())
      .then((json) => setData(json))
      .catch((error) => console.error(error));
  }, []);

  const handleAddTask = async () => {
    if (task) {
      if (editIndex !== -1) {
        fetch(`${apiUrl}/${user.id}/tasks/${editIndex}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ name: task }),
        })
          .then((res) => {
            if (res.ok) {
              return res.json();
            }
            // handle error
          })
          .then((updatedTask) => {
            // Do something with the updated task
            const newData = data.map((item) => {
              if (item.id === updatedTask.id) {
                item.name = updatedTask.name;
              }
              return item; // return the updated item
            });

            // Update the state
            setData(newData);
            setEditIndex(-1);
          })
          .catch((error) => {
            // handle error
            console.log(error);
          });
      } else {
        await fetch(`${apiUrl}/${user.id}/tasks`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ name: task }),
        })
          .then((response) => response.json())
          .then((json) => {
            setData([...data, json]);
          })
          .catch((error) => console.error(error));
      }
      setTask("");
    }
  };
  const handleDeleteTask = async (id) => {
    await fetch(`${apiUrl}/${user.id}/tasks/${id}`, {
      method: "DELETE",
    })
      .then(() => {
        const newData = data.filter((item) => item.id !== id);
        setData(newData);
      })
      .catch((error) => console.error(error));
  };
  const handleEditTask = async (id) => {
    const response = await fetch(`${apiUrl}/${user.id}/tasks/${id}`).then(
      (response) => response.json()
    );
    const editTask = await response.name;
    setTask(editTask);
    setEditIndex(id);
  };

  const renderItem = ({ item }) => (
    <View style={styles.task}>
      <Text style={styles.itemList}>{item.name}</Text>
      <View style={styles.taskButtons}>
        <Pressable onPress={() => handleEditTask(item.id)}>
          <Text style={styles.editButton}>Edit</Text>
        </Pressable>
        <Pressable onPress={() => handleDeleteTask(item.id)}>
          <Text style={styles.deleteButton}>Delete</Text>
        </Pressable>
      </View>
    </View>
  );
  return (
    <View style={styles.container}>
      <Text style={styles.heading}>ToDo App</Text>
      <TextInput
        style={styles.input}
        placeholder="Enter task"
        value={task}
        onChangeText={(text) => setTask(text)}
      />
      <Pressable style={styles.addButton} onPress={() => handleAddTask()}>
        <Text style={styles.addButtonText}>
          {editIndex !== -1 ? "Update Task" : "Add Task"}
        </Text>
      </Pressable>
      <FlatList
        data={data}
        renderItem={renderItem}
        keyExtractor={(item, index) => index.toString()}
      />
      <Button
        onPress={() => navigation.navigate("Login")}
        title="Logout"
        filled
        style={{
          marginTop: 18,
          marginBottom: 4,
        }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 40,
    marginTop: 40,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
  },
  heading: {
    fontSize: 30,
    fontWeight: "bold",
    marginBottom: 7,
    color: "green",
  },
  input: {
    borderWidth: 3,
    borderColor: "#ccc",
    padding: 10,
    marginBottom: 10,
    borderRadius: 10,
    fontSize: 18,
  },
  addButton: {
    backgroundColor: "green",
    padding: 10,
    borderRadius: 5,
    marginBottom: 10,
  },
  addButtonText: {
    color: "white",
    fontWeight: "bold",
    textAlign: "center",
    fontSize: 18,
  },
  task: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 15,
    fontSize: 18,
  },
  itemList: {
    fontSize: 19,
  },
  taskButtons: {
    flexDirection: "row",
  },
  editButton: {
    marginRight: 10,
    color: "green",
    fontWeight: "bold",
    fontSize: 18,
  },
  deleteButton: {
    color: "red",
    fontWeight: "bold",
    fontSize: 18,
  },
});
