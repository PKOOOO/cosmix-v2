// Page.js
import { SafeAreaView, ScrollView, View, Text, TouchableOpacity, Image, Modal, ActivityIndicator } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import React, { useState, useEffect } from "react";
import { useRouter } from "expo-router";
import SideMenu from '../../components/SideMenu';
import getCategories from '../../actions/get-categories';
import { Category } from '../../types';
import Header from "../../components/Header";

export default function Page() {
  const router = useRouter();
  const [isMenuVisible, setMenuVisible] = useState(false);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [heroText, setHeroText] = useState("Palvelut nyt!");

  // New color scheme based on provided HEX codes
  const darkBrown = "#423120";
  const lightBrown = "#D7C3A7";
  const veryLightBeige = "#F4EDE5";
  const white = "#FFFFFF";

  // Fetch categories on component mount
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        setLoading(true);
        setError(null);
        const data = await getCategories();
        setCategories(data);
        console.log('Fetched categories:', data);
      } catch (err) {
        console.error('Error fetching categories:', err);
        setError(err instanceof Error ? err.message : 'Failed to fetch categories');
      } finally {
        setLoading(false);
      }
    };

    fetchCategories();
  }, []);

  // Alternate hero text every 3 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      setHeroText(prevText => 
        prevText === "Palvelut nyt!" ? "Kartta" : "Palvelut nyt!"
      );
    }, 4000);

    return () => clearInterval(interval);
  }, []);

  const items = [
    {
      label: "Gua Sha hoidot",
      img: "https://res.cloudinary.com/dguk4ks45/image/upload/v1755533722/AdobeStock_323915985_kzt3ji.png",
    },
    {
      label: "Ripsienpidennykset",
      img: "https://res.cloudinary.com/dguk4ks45/image/upload/v1755533722/AdobeStock_323915985_kzt3ji.png",
    },
    {
      label: "Hieronnat",
      img: "https://res.cloudinary.com/dguk4ks45/image/upload/v1755533722/AdobeStock_323915985_kzt3ji.png",
    },
    {
      label: "Kynsihoidot",
      img: "https://res.cloudinary.com/dguk4ks45/image/upload/v1755533722/AdobeStock_323915985_kzt3ji.png",
    },
  ];

  // Function to chunk array into rows of 2 items
  const chunkArray = (array: any[], chunkSize: number) => {
    const result = [];
    for (let i = 0; i < array.length; i += chunkSize) {
      result.push(array.slice(i, i + chunkSize));
    }
    return result;
  };

  // Prepare categories for display (all categories)
  const displayCategories = categories.map(cat => cat.name);

  // Chunk into rows of 2
  const categoryRows = chunkArray(displayCategories, 2);

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: white }}>
      {/* FIXED HEADER - Outside ScrollView */}
    <Header onMenuPress={() => setMenuVisible(true)} />

      {/* SCROLLABLE CONTENT */}
      <ScrollView showsVerticalScrollIndicator={false} style={{ flex: 1 }}>
        {/* Hero Section */}
        <View style={{ backgroundColor: lightBrown }} className="px-4 py-6">
          <View style={{ position: "relative", borderRadius: 20, height: 300, alignItems: "center", justifyContent: "center" }}>
            {/* Background vectors (left/right) - behind the hero card */}
            <Image
              source={require("../../../../assets/vector-left.png")}
              style={{
                position: "absolute",
                top: 70,
                left: -55,
                width: 220,
                height: 220,
                opacity: 0.9,
              }}
              resizeMode="contain"
            />
            <Image
              source={require("../../../../assets/vector-right.png")}
              style={{
                position: "absolute",
                top: -2,
                right: -60,
                width: 220,
                height: 210,
                opacity: 0.9,
              }}
              resizeMode="contain"
            />

            <TouchableOpacity
            style={{
              borderRadius: 20,
              overflow: "hidden",
              alignItems: "center",
              height: 300,
              justifyContent: "center",
              position: "relative",
            }}
            onPress={() => router.push("/map")}
            activeOpacity={0.8}
          >
            <Image
              source={{
                uri: "https://res.cloudinary.com/dguk4ks45/image/upload/v1755533724/AdobeStock_130939808_cq1whi.png",
              }}
              style={{
                width: 300,
                height: 213,
                borderRadius: 20,
              }}
              resizeMode="cover"
            />

            <View
              style={{
                position: "absolute",
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <Text
                style={{
                  fontSize: 40,
                  fontFamily: "Philosopher-Bold",
                  color: darkBrown,
                  paddingHorizontal: 16,
                  paddingVertical: 8,
                }}
              >
                {heroText}
              </Text>
            </View>
            
            {/* Dots indicator at bottom of image */}
            <View style={{ 
              position: "absolute", 
              bottom: 50,
              left: 0,
              right: 0,
              flexDirection: "row",
              justifyContent: "center"
            }}>
              <View
                style={{ 
                  width: 11, 
                  height: 11,
                  backgroundColor: darkBrown,
                  borderRadius: 5.5
                }}
              />
              <View
                style={{ 
                  width: 11, 
                  height: 11, 
                  marginLeft: 5,
                  backgroundColor: darkBrown,
                  borderRadius: 5.5
                }}
              />
            </View>
          </TouchableOpacity>
          </View>
        </View>

        {/* POPULAR SERVICES */}
        <View style={{ paddingHorizontal: 16, paddingVertical: 24 }}>
          <Text
            style={{
              color: darkBrown,
              fontFamily: "Philosopher-Bold",
              fontSize: 25,
              textAlign: "center",
            }}
          >
            Kauden suosituimmat palvelut.
          </Text>

          <View
            style={{
              flexDirection: "row",
              flexWrap: "wrap",
              justifyContent: "space-between",
              marginTop: 16,
            }}
          >
            {items.map((item, idx) => (
              <TouchableOpacity
                key={idx}
                style={{ marginBottom: 24, width: "48%", alignItems: "center" }}
                onPress={() => {
                  // Navigate to services with the specific service type
                  router.push({
                    pathname: "/services",
                    params: { categoryName: item.label }
                  });
                }}
                activeOpacity={0.8}
              >
                <Image
                  source={require("../../../../assets/group.png")}
                  style={{ position: "absolute", top: 30, width: 200, height: 210 }}
                  resizeMode="contain"
                />

                <Image
                  source={{ uri: item.img }}
                  style={{
                    width: 127,
                    height: 128,
                    borderRadius: 24,
                  }}
                />

                <Text
                  style={{
                    textAlign: "center",
                    marginTop: 5,
                    color: darkBrown,
                    fontFamily: "Philosopher-Bold",
                    fontSize: 15,
                    maxWidth: 120,
                  }}
                >
                  {item.label}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* TAGLINE */}
        <View style={{ backgroundColor: lightBrown }} className="py-3">
          <View style={{ position: "relative", height: 77, alignItems: "center", justifyContent: "center" }}>
            <Image
              source={require("../../../../assets/wed.png")}
              style={{ position: "absolute",top: -130, width: 300, height: 330, opacity: 1 }}
              resizeMode="contain"
              onError={(e) => {
                console.warn('Failed to load wed.png', e.nativeEvent?.error);
              }}
            />
            <Text
              style={{
                textAlign: "center",
                color: darkBrown,
                fontFamily: "Philosopher-Bold",
                fontSize: 20,
                paddingHorizontal: 16,
              }}
            >
              Hemmottelu, jonka ansaitset.
            </Text>
          </View>
        </View>

        {/* CATEGORIES */}
        <View className="px-4 py-6">
          <Text
            style={{
              textAlign: "center",
              color: darkBrown,
              fontFamily: "Philosopher-Bold",
              fontSize: 25,
              marginBottom: 20,
            }}
          >
            Kategoriat
          </Text>

          {/* Loading State */}
          {loading && (
            <View style={{ alignItems: "center", justifyContent: "center", padding: 20 }}>
              <ActivityIndicator size="large" color={darkBrown} />
              <Text style={{ color: darkBrown, fontFamily: "Philosopher-Regular", marginTop: 10 }}>
                Ladataan kategorioita...
              </Text>
            </View>
          )}

          {/* Error State */}
          {error && (
            <View style={{ alignItems: "center", justifyContent: "center", padding: 20 }}>
              <Text style={{ color: "red", fontFamily: "Philosopher-Regular", textAlign: "center" }}>
                Virhe: {error}
              </Text>
              <TouchableOpacity
                style={{
                  backgroundColor: lightBrown,
                  paddingHorizontal: 20,
                  paddingVertical: 10,
                  borderRadius: 8,
                  marginTop: 10,
                }}
                onPress={() => {
                  // Retry fetching
                  setError(null);
                  setLoading(true);
                  getCategories()
                    .then(setCategories)
                    .catch((err) => setError(err.message))
                    .finally(() => setLoading(false));
                }}
              >
                <Text style={{ fontFamily: "Philosopher-Bold", color: darkBrown }}>
                  Yritä uudelleen
                </Text>
              </TouchableOpacity>
            </View>
          )}

          {/* Categories Grid */}
          {!loading && !error && (
            <View className="mt-4">
              {categoryRows.map((row, rowIdx) => (
                <View key={rowIdx} style={{ flexDirection: "row", justifyContent: "space-between", paddingHorizontal: 20, marginBottom: 16 }}>
                  {row.map((categoryName, colIdx) => (
                    <TouchableOpacity
                      key={colIdx}
                      style={{
                        backgroundColor: lightBrown,
                        width: 160,
                        height: 45,
                        borderRadius: 24,
                        justifyContent: "center",
                        alignItems: "center",
                      }}
                      onPress={() => {
                        // Navigate to services page with category name
                        router.push({
                          pathname: "/services",
                          params: { categoryName }
                        });
                      }}
                    >
                      <Text
                        style={{
                          color: darkBrown,
                          textAlign: "center",
                          fontFamily: "Philosopher-Bold",
                          fontSize: 14,
                          paddingHorizontal: 8,
                        }}
                        numberOfLines={1}
                        ellipsizeMode="tail"
                      >
                        {categoryName}
                      </Text>
                    </TouchableOpacity>
                  ))}
                  {row.length === 1 && <View style={{ width: 160 }} />}
                </View>
              ))}
              {/* "Lisaa" button centered below all categories */}
              <View style={{ width: "100%", alignItems: "center", marginTop: 8 }}>
                <TouchableOpacity
                  style={{
                    backgroundColor: lightBrown,
                    borderRadius: 24,
                    paddingVertical: 10,
                    paddingHorizontal: 28,
                  }}
                  onPress={() => router.push("/categories")}
                >
                  <Text
                    style={{
                      color: darkBrown,
                      fontFamily: "Philosopher-Bold",
                      fontSize: 16,
                    }}
                  >
                    Lisaa
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
          )}
        </View>

        {/* LOGIN & ENTREPRENEURS */}
        <View style={{ backgroundColor: lightBrown }} className="py-8">
          <View className="flex-row" style={{ justifyContent: "center", gap: 49 }}>
            <TouchableOpacity
              style={{
                backgroundColor: veryLightBeige,
                width: 122,
                height: 122,
                borderTopLeftRadius: 100,
                borderTopRightRadius: 100,
                justifyContent: "center",
                alignItems: "center",
              }}
              onPress={() => router.push("/sign-in")}
              activeOpacity={0.8}
            >
              <Text style={{ color: darkBrown, fontSize: 25, fontFamily: "Philosopher-Bold", textAlign: "center" }}>
                Kirjaudu sisään
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={{
                backgroundColor: veryLightBeige,
                width: 122,
                height: 122,
                borderTopLeftRadius: 100,
                borderTopRightRadius: 100,
                justifyContent: "center",
                alignItems: "center",
              }}
              onPress={() => {
                // Could navigate to entrepreneurs page or external link
                console.log('Navigate to entrepreneurs section');
              }}
              activeOpacity={0.8}
            >
              <Text style={{ color: darkBrown, fontSize: 25, fontFamily: "Philosopher-Bold", textAlign: "center" }}>
                Yrittäjille
              </Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* FOOTER LINKS */}
        <View className="py-6 px-4">
          {[
            ["Käyttöehdot", "Palvelut"],
            ["Meistä", "Etusivu"],
            ["Tili", "Lahjakortit"],
            ["Ota yhteyttä", "Ajanvaraus"],
          ].map((row, rowIdx) => (
            <View key={rowIdx} className="flex-row justify-between" style={{ marginBottom: 20 }}>
              {row.map((link, colIdx) => (
                <TouchableOpacity 
                  key={colIdx} 
                  style={{ width: "48%", justifyContent: "center" }}
                  onPress={() => {
                    // Handle footer navigation
                    switch(link) {
                      case "Etusivu":
                        router.push("/");
                        break;
                      case "Palvelut":
                        router.push("/services");
                        break;
                      case "Ajanvaraus":
                        router.push("/booking");
                        break;
                      case "Tili":
                        router.push("/profile");
                        break;
                      default:
                        console.log(`Navigate to: ${link}`);
                        break;
                    }
                  }}
                  activeOpacity={0.7}
                >
                  <Text
                    style={{
                      color: darkBrown,
                      fontSize: 15,
                      marginLeft: 24,
                      fontFamily: "Philosopher-Bold",
                      textAlign: "left",
                    }}
                  >
                    {link}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          ))}
        </View>
      </ScrollView>

      {/* Modal for the side menu */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={isMenuVisible}
        onRequestClose={() => setMenuVisible(false)}
      >
        <View style={{ flex: 1, backgroundColor: 'rgba(0, 0, 0, 0.5)' }}>
          <View
            style={{
              width: '100%',
              height: '100%',
              backgroundColor: veryLightBeige,
              alignSelf: 'flex-end',
            }}
          >
            <SideMenu onClose={() => setMenuVisible(false)} />
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}
