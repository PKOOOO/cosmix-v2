// src/app/(app)/salon-sector.tsx
import React, { useState, useEffect, useRef } from "react";
import { SafeAreaView, View, Text, ScrollView, TouchableOpacity, ActivityIndicator, Image, Modal, Animated, Easing } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useRouter, useLocalSearchParams } from "expo-router";
import Header from "../components/Header";
import SideMenu from "../components/SideMenu";
import getServicesBySalon from "../actions/get-services-by-salon";
import { Service } from "../types";
import { Salon } from "../../../types/salon";
import getSaloonsMap from "../actions/get-saloons-map";

const darkBrown = "#3C2C1E";
const beige = "#D9C7AF";
const lightBeige = "#E4D2BA";
const chipBeige = "#D7C3A7";

const SalonSector = () => {
    const router = useRouter();
    const { salonId, salonName } = useLocalSearchParams<{
        salonId: string;
        salonName?: string;
    }>();

    const [salon, setSalon] = useState<Salon | null>(null);
    const [services, setServices] = useState<Service[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [isMenuVisible, setMenuVisible] = useState(false);

    // Fetch salon details and services
    useEffect(() => {
        const fetchSalonData = async () => {
            if (!salonId) {
                setError('No salon selected');
                setLoading(false);
                return;
            }

            try {
                setLoading(true);
                setError(null);
                
                // Fetch all salons and find the specific one
                const allSalons = await getSaloonsMap();
                const foundSalon = allSalons.find(s => s.id === salonId);
                
                if (!foundSalon) {
                    throw new Error('Salon not found');
                }
                
                setSalon(foundSalon);
                
                // Fetch services for this salon
                const salonServices = await getServicesBySalon(salonId);
                setServices(salonServices);
                
                console.log('Fetched salon:', foundSalon);
                console.log('Fetched services:', salonServices);
            } catch (err) {
                console.error('Error fetching salon data:', err);
                setError(err instanceof Error ? err.message : 'Failed to fetch salon data');
            } finally {
                setLoading(false);
            }
        };

        if (salonId) {
            fetchSalonData();
        }
    }, [salonId]);

    // Group services by category
    const getCategoriesFromServices = () => {
        const categoryMap = new Map<string, { id: string; name: string; count: number }>();
        
        services.forEach(service => {
            if (service.category) {
                const categoryId = service.category.id;
                const categoryName = service.category.name;
                
                if (categoryMap.has(categoryId)) {
                    const existing = categoryMap.get(categoryId)!;
                    categoryMap.set(categoryId, { ...existing, count: existing.count + 1 });
                } else {
                    categoryMap.set(categoryId, { id: categoryId, name: categoryName, count: 1 });
                }
            }
        });
        
        return Array.from(categoryMap.values());
    };

    const categories = getCategoriesFromServices();

    const onCategoryPress = (categoryName: string) => {
        router.push({ 
            pathname: "/services", 
            params: { 
                categoryName, 
                salonId: salonId,
                salonName: salonName || salon?.name 
            } 
        });
    };

    return (
        <SafeAreaView style={{ flex: 1, backgroundColor: "white" }}>
            {/* Header - Fixed at Top */}
            <Header
                title="COSMIX"
                showBack={true}
                showMenu={true}
                onBackPress={() => router.back()}
                onMenuPress={() => setMenuVisible(true)}
            />

            {/* SCROLLABLE CONTENT */}
            <ScrollView
                style={{ flex: 1, backgroundColor: "white" }}
                contentContainerStyle={{ paddingBottom: 100 }}
                showsVerticalScrollIndicator={false}
            >
                {/* HERO SECTION */}
                <View style={{ backgroundColor: beige, height: 320 }}>
                    {/* White Box - Centered */}
                    <View style={{ flex: 1, alignItems: "center", justifyContent: "center" }}>
                        <View
                            style={{ 
                                width: 310, 
                                height: 200,
                                backgroundColor: "white",
                                borderRadius: 24,
                                alignItems: "center",
                                justifyContent: "center",
                                shadowColor: "#000",
                                shadowOffset: { width: 0, height: 2 },
                                shadowOpacity: 0.1,
                                shadowRadius: 4,
                                elevation: 3,
                                position: "relative"
                            }}
                        >
                            {/* Title - Salon Name */}
                            <Text
                                style={{
                                    fontFamily: "Philosopher-Bold",
                                    fontSize: 40,
                                    color: darkBrown,
                                    textAlign: "center",
                                    paddingHorizontal: 16
                                }}
                            >
                                {salonName || salon?.name || "Salon"}
                            </Text>

                            {/* Ellipses at bottom */}
                            <View style={{ 
                                position: "absolute", 
                                bottom: 16, 
                                flexDirection: "row" 
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
                                <View
                                    style={{ 
                                        width: 11, 
                                        height: 11, 
                                        marginLeft: 5,
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
                        </View>
                    </View>
                </View>

                {/* Loading State */}
                {loading && (
                    <View style={{ alignItems: "center", marginTop: 80 }}>
                        <ActivityIndicator size="large" color={darkBrown} />
                        <Text
                            style={{
                                fontFamily: "Philosopher-Bold",
                                fontSize: 16,
                                color: darkBrown,
                                marginTop: 10,
                            }}
                        >
                            Loading salon...
                        </Text>
                    </View>
                )}

                {/* Error State */}
                {error && (
                    <View style={{ alignItems: "center", marginTop: 80, paddingHorizontal: 16 }}>
                        <Text
                            style={{
                                fontFamily: "Philosopher-Bold",
                                fontSize: 16,
                                color: "red",
                                textAlign: "center",
                                marginBottom: 20,
                            }}
                        >
                            Error: {error}
                        </Text>
                        <TouchableOpacity
                            style={{
                                backgroundColor: beige,
                                paddingHorizontal: 20,
                                paddingVertical: 10,
                                borderRadius: 8,
                            }}
                            onPress={() => router.back()}
                        >
                            <Text style={{ fontFamily: "Philosopher-Bold", color: darkBrown }}>
                                Go Back
                            </Text>
                        </TouchableOpacity>
                    </View>
                )}

                {/* Salon Card and Categories */}
                {!loading && !error && salon && (
                    <>
                        {/* Single Salon Card */}
                        <TouchableOpacity 
                            style={{ alignItems: "center", marginTop: 24, position: "relative" }}
                            activeOpacity={1}
                        >
                            {/* First Box - Top Box (310x200) - Salon Picture */}
                            <View
                                style={{ 
                                    width: 310, 
                                    height: 200,
                                    backgroundColor: lightBeige,
                                    borderRadius: 24,
                                    position: "absolute",
                                    zIndex: 10,
                                    alignItems: "center",
                                    justifyContent: "center",
                                    overflow: "hidden"
                                }}
                            >
                                {salon.images && salon.images.length > 0 && salon.images[0].url ? (
                                    <Image
                                        source={{ uri: salon.images[0].url }}
                                        style={{
                                            width: "100%",
                                            height: "100%",
                                            borderRadius: 24
                                        }}
                                        resizeMode="cover"
                                    />
                                ) : (
                                    <View style={{
                                        width: "100%",
                                        height: "100%",
                                        backgroundColor: lightBeige,
                                        borderRadius: 24,
                                        alignItems: "center",
                                        justifyContent: "center"
                                    }}>
                                        <Ionicons name="business-outline" size={48} color={darkBrown} />
                                        <Text style={{ 
                                            color: darkBrown, 
                                            fontFamily: "Philosopher-Regular",
                                            marginTop: 8,
                                            fontSize: 14
                                        }}>
                                            {salon.name}
                                        </Text>
                                    </View>
                                )}
                            </View>

                            {/* Second Box - Bottom Box (310x190) - Salon Info */}
                            <View
                                style={{ 
                                    width: 310, 
                                    height: 190, 
                                    marginTop: 140, 
                                    borderWidth: 2, 
                                    borderColor: chipBeige,
                                    backgroundColor: "white",
                                    borderRadius: 24,
                                    justifyContent: "center",
                                    paddingVertical: 16
                                }}
                            >
                                <View style={{ marginTop: 40 }}>
                                    <View style={{ paddingHorizontal: 16 }}>
                                        <Text
                                            style={{
                                                fontFamily: "Philosopher-Bold",
                                                fontSize: 20,
                                                color: darkBrown,
                                                marginTop: 28
                                            }}
                                        >
                                            {salon.name}
                                        </Text>
                                    </View>

                                    <View style={{ 
                                        borderBottomWidth: 1, 
                                        marginTop: 8, 
                                        borderBottomColor: beige 
                                    }} />

                                    <View style={{ paddingHorizontal: 16 }}>
                                        <Text
                                            style={{
                                                fontFamily: "Philosopher-Bold",
                                                fontSize: 15,
                                                color: "#423120",
                                                marginTop: 4
                                            }}
                                        >
                                            {salon.shortIntro || 'No description'}
                                        </Text>
                                        <Text
                                            style={{
                                                fontFamily: "Philosopher-Bold",
                                                fontSize: 15,
                                                color: "#423120",
                                                marginTop: 4
                                            }}
                                        >
                                            Location: {salon.address || 'Not specified'}
                                        </Text>

                                        <View style={{ 
                                            flexDirection: "row", 
                                            alignItems: "center", 
                                            marginTop: 4 
                                        }}>
                                            <Text
                                                style={{
                                                    fontFamily: "Philosopher-Bold",
                                                    fontSize: 15,
                                                    color: "#423120",
                                                    marginBottom: 9,
                                                }}
                                            >
                                                Arviot:{" "}
                                            </Text>
                                            <Text
                                                style={{
                                                    color: "#E0CFB9",
                                                    fontSize: 13,
                                                    lineHeight: 13,
                                                    marginBottom: 9,
                                                }}
                                            >
                                                {"★".repeat(Math.round(salon.averageRating || salon.rating || 5))}
                                            </Text>
                                        </View>
                                    </View>
                                </View>
                            </View>
                        </TouchableOpacity>

                        {/* Categories Section */}
                        {categories.length > 0 && (
                            <View style={{ paddingHorizontal: 20, marginTop: 32 }}>
                                {/* Section title */}
                                <Text style={{ color: darkBrown, fontFamily: 'Philosopher-Bold', fontSize:30 , textAlign: 'center' }}>
                                Kaikki palvelut
                                </Text>

                                {/* Categories Chips grid - Same layout as Suosituimmat palvelut (2-1-2-1 pattern) */}
                                <View style={{ marginTop: 20 }}>
                                    {/* First row - 2 chips */}
                                    {categories.length > 0 && (
                                        <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: 20, paddingHorizontal: 8 }}>
                                            {categories.slice(0, 2).map((category) => (
                                                <Chip 
                                                    key={category.id} 
                                                    label={category.name} 
                                                    onPress={() => onCategoryPress(category.name)} 
                                                    color={chipBeige} 
                                                    textColor={darkBrown} 
                                                />
                                            ))}
                                            {categories.length === 1 && (
                                                <View style={{ width: 147 }} />
                                            )}
                                        </View>
                                    )}
                                    
                                    {/* Second row - 1 chip centered */}
                                    {categories.length > 2 && (
                                        <View style={{ flexDirection: 'row', justifyContent: 'center', marginBottom: 20 }}>
                                            <Chip 
                                                label={categories[2].name} 
                                                onPress={() => onCategoryPress(categories[2].name)} 
                                                color={chipBeige} 
                                                textColor={darkBrown} 
                                            />
                                        </View>
                                    )}
                                    
                                    {/* Third row - 2 chips */}
                                    {categories.length > 3 && (
                                        <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: 20, paddingHorizontal: 8 }}>
                                            {categories.slice(3, 5).map((category) => (
                                                <Chip 
                                                    key={category.id} 
                                                    label={category.name} 
                                                    onPress={() => onCategoryPress(category.name)} 
                                                    color={chipBeige} 
                                                    textColor={darkBrown} 
                                                />
                                            ))}
                                            {categories.length === 4 && (
                                                <View style={{ width: 147 }} />
                                            )}
                                        </View>
                                    )}
                                    
                                    {/* Fourth row - 1 chip centered */}
                                    {categories.length > 5 && (
                                        <View style={{ flexDirection: 'row', justifyContent: 'center', marginBottom: 20 }}>
                                            <Chip 
                                                label={categories[5].name} 
                                                onPress={() => onCategoryPress(categories[5].name)} 
                                                color={chipBeige} 
                                                textColor={darkBrown} 
                                            />
                                        </View>
                                    )}
                                    
                                    {/* Additional rows following the same pattern if more categories */}
                                    {categories.length > 6 && categories.slice(6).map((category, idx) => {
                                        const position = idx % 3;
                                        // Pattern: 0,1 = row of 2, 2 = centered
                                        if (position === 0) {
                                            const nextCategory = categories[6 + idx + 1];
                                            return (
                                                <View key={category.id} style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: 20, paddingHorizontal: 8 }}>
                                                    <Chip 
                                                        label={category.name} 
                                                        onPress={() => onCategoryPress(category.name)} 
                                                        color={chipBeige} 
                                                        textColor={darkBrown} 
                                                    />
                                                    {nextCategory ? (
                                                        <Chip 
                                                            label={nextCategory.name} 
                                                            onPress={() => onCategoryPress(nextCategory.name)} 
                                                            color={chipBeige} 
                                                            textColor={darkBrown} 
                                                        />
                                                    ) : (
                                                        <View style={{ width: 147 }} />
                                                    )}
                                                </View>
                                            );
                                        } else if (position === 2) {
                                            return (
                                                <View key={category.id} style={{ flexDirection: 'row', justifyContent: 'center', marginBottom: 20 }}>
                                                    <Chip 
                                                        label={category.name} 
                                                        onPress={() => onCategoryPress(category.name)} 
                                                        color={chipBeige} 
                                                        textColor={darkBrown} 
                                                    />
                                                </View>
                                            );
                                        }
                                        return null;
                                    })}
                                </View>
                            </View>
                        )}

                        {categories.length === 0 && !loading && (
                            <View style={{ alignItems: "center", marginTop: 40, paddingHorizontal: 16 }}>
                                <Text
                                    style={{
                                        fontFamily: "Philosopher-Bold",
                                        fontSize: 16,
                                        color: darkBrown,
                                        textAlign: "center",
                                        opacity: 0.6,
                                    }}
                                >
                                    No services available at this salon
                                </Text>
                            </View>
                        )}
                    </>
                )}
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
                            backgroundColor: '#F4EDE5',
                            alignSelf: 'flex-end',
                        }}
                    >
                        <SideMenu onClose={() => setMenuVisible(false)} />
                    </View>
                </View>
            </Modal>
        </SafeAreaView>
    );
};

// Helper function to chunk array
function chunkArray<T>(arr: T[], size: number): T[][] {
    const out: T[][] = [];
    for (let i = 0; i < arr.length; i += size) out.push(arr.slice(i, i + size));
    return out;
}

// Chip component - Same as in service.tsx
function Chip({ label, onPress, color, textColor }: { label: string; onPress: () => void; color: string; textColor: string }) {
    const [containerWidth, setContainerWidth] = useState(0);
    const [textWidth, setTextWidth] = useState(0);
    const translateX = useRef(new Animated.Value(0)).current;
  
    const H_PADDING = 16; // internal horizontal padding so text doesn't touch edges
    const effectiveWidth = Math.max(0, containerWidth - H_PADDING * 2);
    const shouldScroll = textWidth > effectiveWidth && effectiveWidth > 0;
  
    useEffect(() => {
      let loop: Animated.CompositeAnimation | null = null;
      if (shouldScroll) {
        // Start centered if possible, then animate to left and back
        translateX.setValue(0);
        const distance = textWidth - effectiveWidth;
        loop = Animated.loop(
          Animated.sequence([
            Animated.timing(translateX, {
              toValue: -distance,
              duration: Math.min(14000, 5000 + distance * 30),
              easing: Easing.linear,
              useNativeDriver: true,
            }),
            Animated.timing(translateX, {
              toValue: 0,
              duration: 1000,
              easing: Easing.linear,
              useNativeDriver: true,
            }),
          ])
        );
        loop.start();
      }
      return () => {
        if (loop) loop.stop();
      };
    }, [shouldScroll, textWidth, effectiveWidth, translateX]);
  
    return (
      <TouchableOpacity
        onPress={onPress}
        style={{ backgroundColor: color, width: 147, height: 45 }}
        className="rounded-full items-center justify-center"
      >
        <View
          style={{ width: "100%", overflow: "hidden", alignItems: "center", paddingHorizontal: H_PADDING }}
          onLayout={(e) => setContainerWidth(e.nativeEvent.layout.width)}
        >
          <Animated.View style={{ transform: [{ translateX: shouldScroll ? translateX : 0 }], alignItems: "center" }}>
            <Text
              onLayout={(e) => setTextWidth(e.nativeEvent.layout.width)}
              numberOfLines={1}
              style={{ color: textColor, fontFamily: 'Philosopher-Bold', fontSize: 15, textAlign: 'center' }}
            >
              {label}
            </Text>
          </Animated.View>
        </View>
      </TouchableOpacity>
    );
}

export default SalonSector;

