import { useFilterStore } from "@/store/filterStore";
import { MaterialIcons } from "@expo/vector-icons";
import DateTimePicker, {
  DateTimePickerAndroid,
} from "@react-native-community/datetimepicker";
import { useState } from "react";
import { Platform, StyleSheet, Text, TouchableOpacity } from "react-native";

const DateFilter = () => {
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [showDatePicker, setShowDatePicker] = useState(false);

  const setFilter = useFilterStore((state) => state.setFilter);

  const onChange = (event, newDate) => {
    if (event.type === "dismissed") {
      setShowDatePicker(false);
      return;
    }
    const currentDate = newDate || selectedDate;
    const formattedDate = selectedDate
      ? currentDate.toISOString().split("T")[0]
      : "";
    setFilter("DATE", formattedDate);

    if (Platform.OS === "ios") {
      setShowDatePicker(false);
    }
    setSelectedDate(currentDate);

    if (Platform.OS === "android" && event.type === "dismissed") {
      setShowDatePicker(false);
    }
  };

  const showMode = (currentMode) => {
    if (Platform.OS === "android") {
      DateTimePickerAndroid.open({
        value: selectedDate,
        onChange: onChange,
        mode: currentMode,
        is24Hour: true,
        display: "default",
        maximumDate: new Date(),
      });
    } else {
      setShowDatePicker(true);
      // <DateTimePickernewDate
      //   testID="dateTimePicker"
      //   value={selectedDate}
      //   mode="date"
      //   is24Hour={true}
      //   onChange={onChange}
      //   display="spinner"
      //   maximumDate={new Date()}
      // />
    }
  };

  const showPicker = () => {
    showMode("date");
  };

  return (
    <TouchableOpacity style={styles.container} onPress={showPicker}>
      <MaterialIcons name="date-range" size={24} />
      <Text style={{ fontSize: 16 }}>Date</Text>

      {showDatePicker && Platform.OS === "ios" && (
        <DateTimePicker
          testID="dateTimePicker"
          value={selectedDate}
          mode="date"
          is24Hour={true}
          onChange={onChange}
          display="inline"
          maximumDate={new Date()}
        />
      )}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 2,
    paddingHorizontal: 15,
    paddingVertical: 5,
    backgroundColor: "#fff",
    borderRadius: 10,
    elevation: 2,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 4,
    // marginBottom: 10,
  },
});

export default DateFilter;
