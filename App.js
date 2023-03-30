import { setStatusBarBackgroundColor, StatusBar } from 'expo-status-bar';
import { Button } from 'react-native';
import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, TextInput, View } from 'react-native';
import { BarCodeScanner } from 'expo-barcode-scanner';
import { Camera } from 'expo-camera';
import axios from 'axios';

export default function App() {

  /*const [cameraPermission, setCameraPermission] = useState(false);
  const [hasPermission, setHasPermission] = useState(false);

  useEffect(() => {
    (async () => {
      const { statusCam } = await Camera.requestCameraPermissionsAsync();
    
      const { statusBar } = await BarCodeScanner.requestPermissionsAsync();
    setCameraPermission(statusCam === 'granted');
    setHasPermission(statusBar === 'granted');
    console.log(statusCam)
    console.group(statusBar)
    })();
  }, []); 

  

  return (
    <View style={styles.container}>
      <Text>Hi Mama</Text>
      <TextInput>sdf</TextInput>
      <StatusBar style="auto" />
    </View>
  ); */

  const fetchNutritionData = async (barcode) => {
    const response = await axios.get(`https://world.openfoodfacts.org/api/v0/product/${barcode}.json`);
    const productData = response.data.product;
    let price;
    if (productData.product_data) {
    price = productData.product_data.price;
    }
    const nutrients1 = {
    name: productData.product_name,
    protein: productData.nutriments['proteins'],
    fat: productData.nutriments['fat'],
    sugar: productData.nutriments['sugars'],
    calories: productData.nutriments['energy-kcal'],
    price: price
    };
    protkcal1 = nutrients1.protein/nutrients1.calories;
    console.log(protsugar1)
    protsugar1 = nutrients1.protein/nutrients1.sugar;
    protsugar1 = Math.round(protsugar1*100)/100;
    console.log(protsugar1)
    setProtsugar(JSON.stringify(protsugar1));

    console.log(protkcal1);
    setProteinprice("No Price given");
    setNutrients(JSON.stringify(nutrients1));
    console.log(nutrients);
    console.log("------------------------------------------------------");
    console.log("------------------------------------------------------");
    console.log("------------------------------------------------------");
    console.log("------------------------------------------------------");
    setScanned(true);
    setOnce(true);
    

    return nutrients;
  };
  const [nutrients, setNutrients] =  useState()
  const [hasPermission, setHasPermission] = useState(null);
  const [scanned, setScanned] = useState(true);
  const [scan, setScan] = useState(false);
  const [error, setError] = useState(null);
  const [protkcal, setProtkcal] = useState();
  const [protsugar, setProtsugar] = useState();
  const [proteinprice, setProteinprice] = useState();
  const [once, setOnce] = useState(false);

  const handleBarCodeScanned = async ({ type, data }) => {
    setScanned(true);
    try {
      const nutritionData = await fetchNutritionData(data);
      console.log('Nutrition data:', nutritionData);
    } catch (error) {
      console.error('Error fetching nutrition data:', error);
    }
  };

  useEffect(() => {
    (async () => {
      const { status } = await BarCodeScanner.requestPermissionsAsync();
      setHasPermission(status === 'granted');
    })();
  }, []);

  if (hasPermission === null) {
    return <Text>Requesting camera permission</Text>;
  }

  if (hasPermission === false) {
    return <Text>No access to camera</Text>;
  }

  return (
    <View style={styles.container}>
      <Button title={'Tap to Scan Barcode'} onPress={() => setScanned(false)} />
      {!scanned && <BarCodeScanner
        onBarCodeScanned={scanned ? undefined : handleBarCodeScanned}
        style={StyleSheet.absoluteFillObject}
      />}
      {scanned && (
        <Text style={styles.nutritionData}> Protein per calories: 
          {error ? error : protsugar} {/* Render the JSON string */}
        </Text>
      )}
      {scanned && <Text>No price given, cant calculate protein/price etc.</Text>}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  nutritionData: {
    backgroundColor: '#fff',
    color: '#000',
    padding: 20,
    fontSize: 16,
  },
});
