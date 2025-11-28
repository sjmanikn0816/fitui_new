// screens/WonItScreen.tsx
import { Colors } from "@/constants/Colors";
import { consultationTypesData, doctors } from "@/data/dummyData";
import { Doctor, MomItScreensprops } from "@/types";
import React, { useState } from "react";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Image,
  Dimensions,
  TextInput,
  StyleSheet,
} from "react-native";
import Icon from "react-native-vector-icons/MaterialIcons";
import { BlurView } from "expo-blur";
import { LinearGradient } from "expo-linear-gradient";
import styles from "./styles/MomItScreenStyles";

const { width, height } = Dimensions.get("window");

const MomItScreen: React.FC<MomItScreensprops> = ({ navTab }) => {
  const [selectedConsultationType, setSelectedConsultationType] =
    useState<string>("video");
  const [selectedDoctor, setSelectedDoctor] = useState<Doctor | null>(null);
  const [selectedTimeSlot, setSelectedTimeSlot] = useState<string>("10:00 AM");
  const [consultationNotes, setConsultationNotes] = useState<string>("");

  const ConsultationTypeCard: React.FC<{ type: any }> = ({ type }) => (
    <TouchableOpacity
      style={[
        styles.consultationTypeCard,
        {
          borderColor:
            selectedConsultationType === type.id ? Colors.emerald : Colors.borderDark,
          borderWidth: 2,
          backgroundColor:
            selectedConsultationType === type.id ? "rgba(52, 211, 153, 0.15)" : Colors.bgCard,
        },
      ]}
      onPress={() => setSelectedConsultationType(type.id)}
    >
      <View
        style={[
          styles.consultationIconContainer,
          { backgroundColor: type.bgColor },
        ]}
      >
        <Icon name={type.icon} size={24} color={type.iconColor} />
      </View>
      <Text style={styles.consultationTypeTitle}>{type.title}</Text>
      <Text style={styles.consultationTypePrice}>{type.price}</Text>
    </TouchableOpacity>
  );

  const DoctorCard: React.FC<{ doctor: Doctor }> = ({ doctor }) => {
    const getSpecialtyIcon = (specialty: string) => {
      switch (specialty) {
        case "Cardiologist":
          return "favorite";
        case "Dermatologist":
          return "healing";
        case "Pediatrician":
          return "child-care";
        default:
          return "medical-services";
      }
    };

    return (
      <View style={styles.doctorCard}>
        <Image source={{ uri: doctor.image }} style={styles.doctorAvatar} />
        <View style={styles.doctorContent}>
          <View style={styles.doctorHeader}>
            <Text style={styles.doctorName}>{doctor.name}</Text>
            <View style={styles.ratingContainer}>
              {[1, 2, 3, 4, 5].map((star) => (
                <Icon
                  key={star}
                  name="star"
                  size={12}
                  color={
                    star <= Math.floor(doctor.rating) ? "#FFD700" : Colors.borderDark
                  }
                />
              ))}
              <Text style={styles.ratingText}>{doctor.rating}</Text>
            </View>
          </View>

          <View
            style={{ flexDirection: "row", alignItems: "center", marginTop: 4 }}
          >
            <Icon
              name={getSpecialtyIcon(doctor.specialty)}
              size={14}
              color={Colors.primary}
              style={{ marginRight: 4 }}
            />
            <Text style={styles.doctorSpecialty}>{doctor.specialty}</Text>
          </View>

          <Text style={styles.doctorExperience}>{doctor.experience}</Text>

          <View style={styles.doctorFooter}>
            <View style={styles.availabilityBadge}>
              <Icon name="videocam" size={12} color={Colors.primary} />
              <Text style={styles.availabilityText}>Today at 2:00pm</Text>
            </View>
            <Text style={styles.sessionPrice}>
              ${doctor.sessionPrice}/Session
            </Text>
          </View>
        </View>
      </View>
    );
  };

  const TimeSlotButton: React.FC<{ time: string }> = ({ time }) => (
    <TouchableOpacity
      style={[
        styles.timeSlotButton,
        {
          backgroundColor:
            selectedTimeSlot === time ? Colors.emerald : Colors.bgCard,
          borderColor: selectedTimeSlot === time ? Colors.emerald : Colors.borderDark,
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "center",
        },
      ]}
      onPress={() => setSelectedTimeSlot(time)}
    >
      <Icon
        name="access-time"
        size={14}
        color={selectedTimeSlot === time ? Colors.bgPrimary : Colors.textSecondary}
        style={{ marginRight: 4 }}
      />
      <Text
        style={[
          styles.timeSlotText,
          { color: selectedTimeSlot === time ? Colors.bgPrimary : Colors.textPrimary },
        ]}
      >
        {time}
      </Text>
    </TouchableOpacity>
  );

  const SectionHeader: React.FC<{ title: string }> = ({ title }) => (
    <View style={styles.sectionHeader}>
      <View style={styles.sectionDot} />
      <Text style={styles.sectionTitle}>{title}</Text>
    </View>
  );

  const renderContent = () => (
    <View style={styles.content}>
      <View style={styles.section}>
        <SectionHeader title="Consultation Type" />
        <View style={styles.consultationTypeGrid}>
          {consultationTypesData.map((type) => (
            <ConsultationTypeCard key={type.id} type={type} />
          ))}
        </View>
      </View>

      <View style={styles.section}>
        <SectionHeader title="Available Health Professionals" />
        {doctors.map((doctor) => (
          <DoctorCard key={doctor.id} doctor={doctor} />
        ))}
      </View>

      <View style={styles.section}>
        <SectionHeader title="Available Time Slots" />
        <View style={styles.timeSlotGrid}>
          {[
            ["9:00 AM", "10:00 AM", "11:00 AM"],
            ["12:00 PM", "1:00 PM", "2:00 PM"],
            ["4:00 PM", "5:00 PM"],
          ].map((row, rowIndex) => (
            <View key={rowIndex} style={styles.timeSlotRow}>
              {row.map((time) => (
                <TimeSlotButton key={time} time={time} />
              ))}
            </View>
          ))}
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Consultation Notes</Text>
        <Text style={styles.questionText}>What would you like to discuss?</Text>
        <TextInput
          style={styles.textArea}
          placeholder="Describe your health goals, concerns, or questions for the consultation..."
          multiline
          numberOfLines={4}
          value={consultationNotes}
          onChangeText={setConsultationNotes}
          textAlignVertical="top"
        />
      </View>

      <TouchableOpacity style={styles.bookButton}>
        <Icon
          name="event"
          size={20}
          color="#FFFFFF"
          style={styles.bookButtonIcon}
        />
        <Text style={styles.bookButtonText}>Book Consultation - $45</Text>
      </TouchableOpacity>
    </View>
  );

  return (
    <View style={{ flex: 1 }}>
      {/* Main scroll content */}
      <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
        {renderContent()}
        <View style={{ height: 30 }} />
      </ScrollView>

      {/* 🌫️ BLUR OVERLAY + CENTERED COMING SOON */}
      <BlurView
        intensity={80}
        tint="dark"
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          width,
          height,
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <LinearGradient
          colors={["rgba(10, 10, 12, 0.7)", "rgba(10, 10, 12, 0.9)"]}
          style={StyleSheet.absoluteFillObject}
        />

        {/* Centered Content */}
        <View style={localStyles.centerBox}>
          <Text style={localStyles.comingSoonText}>Coming Soon</Text>
          <Text style={localStyles.subText}>
            This feature will be available shortly.
          </Text>
        </View>
      </BlurView>
    </View>
  );
};

const localStyles = StyleSheet.create({
  centerBox: {
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: Colors.bgCard,
    paddingVertical: 32,
    paddingHorizontal: 48,
    borderRadius: 24,
    bottom: 150,
    borderWidth: 1,
    borderColor: Colors.borderDark,
    shadowColor: Colors.emerald,
    shadowOpacity: 0.3,
    shadowRadius: 20,
    shadowOffset: { width: 0, height: 8 },
    elevation: 8,
  },
  comingSoonText: {
    fontSize: 32,
    fontWeight: "700",
    color: Colors.emerald,
    textAlign: "center",
  },
  subText: {
    fontSize: 16,
    color: Colors.textSecondary,
    textAlign: "center",
    marginTop: 12,
  },
});

export default MomItScreen;
