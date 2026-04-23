import React, { useState } from 'react';
import { View, Text, TouchableOpacity, Modal, FlatList, StyleSheet } from 'react-native';
import { useGlobalContext } from '../context/GlobalContext';
import { Colors } from '../constants/Colors';

export const ProjectPicker = () => {
  const { state, dispatch } = useGlobalContext();
  const [open, setOpen] = useState(false);

  return (
    <>
      <TouchableOpacity style={styles.picker} onPress={() => setOpen(true)}>
        <Text style={styles.pickerText} numberOfLines={1}>
          {state.selectedProject ? state.selectedProject.name : 'Select project'}
        </Text>
        <Text style={styles.chevron}>▾</Text>
      </TouchableOpacity>

      <Modal visible={open} transparent animationType="slide">
        <TouchableOpacity style={styles.overlay} activeOpacity={1} onPress={() => setOpen(false)}>
          <View style={styles.sheet}>
            <View style={styles.handle} />
            <Text style={styles.sheetTitle}>Select Project</Text>
            {state.projects.length === 0 && (
              <Text style={styles.empty}>No projects yet</Text>
            )}
            <FlatList
              data={state.projects}
              keyExtractor={(item) => item._id}
              renderItem={({ item }) => (
                <TouchableOpacity
                  style={[
                    styles.item,
                    state.selectedProject?._id === item._id && styles.itemActive,
                  ]}
                  onPress={() => {
                    dispatch({ type: 'SET_SELECTED_PROJECT', payload: item });
                    setOpen(false);
                  }}
                >
                  <Text style={[styles.itemText, state.selectedProject?._id === item._id && styles.itemTextActive]}>
                    {item.name}
                  </Text>
                  {state.selectedProject?._id === item._id && <Text style={styles.check}>✓</Text>}
                </TouchableOpacity>
              )}
            />
          </View>
        </TouchableOpacity>
      </Modal>
    </>
  );
};

const styles = StyleSheet.create({
  picker: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
    backgroundColor: Colors.inputBg, borderWidth: 1, borderColor: Colors.border,
    borderRadius: 12, paddingHorizontal: 12, paddingVertical: 9, flex: 1,
  },
  pickerText: { color: Colors.text, fontSize: 13, fontWeight: '500', flex: 1, marginRight: 6 },
  chevron: { color: Colors.textMuted, fontSize: 12 },
  overlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.4)', justifyContent: 'flex-end' },
  sheet: {
    backgroundColor: Colors.white, borderTopLeftRadius: 24, borderTopRightRadius: 24,
    paddingHorizontal: 20, paddingBottom: 32, maxHeight: '70%',
  },
  handle: {
    width: 36, height: 4, backgroundColor: Colors.border,
    borderRadius: 2, alignSelf: 'center', marginTop: 12, marginBottom: 16,
  },
  sheetTitle: { fontSize: 16, fontWeight: '700', color: Colors.text, marginBottom: 12 },
  empty: { color: Colors.textMuted, fontSize: 13, textAlign: 'center', paddingVertical: 20 },
  item: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
    paddingVertical: 13, paddingHorizontal: 14, borderRadius: 12, marginBottom: 6,
    backgroundColor: Colors.inputBg,
  },
  itemActive: { backgroundColor: Colors.primaryLight },
  itemText: { fontSize: 14, color: Colors.text, fontWeight: '500' },
  itemTextActive: { color: Colors.white },
  check: { color: Colors.white, fontSize: 14, fontWeight: '700' },
});
