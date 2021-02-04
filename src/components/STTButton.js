import { StatusBar } from "expo-status-bar";
import React, { useEffect, useState } from "react";
import { StyleSheet, Text, View, Button, TouchableOpacity, Platform, Dimensions } from "react-native";
import { Audio, AVPlaybackStatus} from "expo-av";
import { MaterialCommunityIcons } from '@expo/vector-icons';
import * as Permissions from "expo-permissions";
import * as FileSystem from 'expo-file-system';
import axios from 'axios';
import key from '../../API-KEY';

export default function STTButton({handleTranscript, handleTest, handleExplanation}) {
  const { width: viewportWidth, height: viewportHeight } = Dimensions.get('window');
  const r = viewportWidth/12;
  const API_KEY = key;
  const [recording, setRecording] = useState();
  const [isAllowRecord, setAllowRecord] = useState("No");
  const [recordingStatus, setRecordingStatus] = useState();
  const [isFetching, setIsFetching] = useState(false);
  const [transcript, setTranscript] = useState();

  // 녹음된 소리 듣기 위한 코드
  const [muted, setMuted] = useState();
  const [volume, setVolume] = useState();
  const [rate, setRate] = useState();
  const [shouldCorrectPitch, setShouldCorrectPitch] = useState();
  const [sound, setSound] = useState();

  // similar to componentDidMount and componentDidUpdate
  useEffect(() => {
    _askForPermissions();
  });

  // 권환 획득
  async function _askForPermissions() {
    const response = await Permissions.askAsync(Permissions.AUDIO_RECORDING);
    setAllowRecord(response.status);
  }

  const recordingOptions = {
    android: {
      extension: '.mp3',
      outputFormat: Audio.RECORDING_OPTION_ANDROID_OUTPUT_FORMAT_DEFAULT,
      audioEncoder: Audio.RECORDING_OPTION_ANDROID_AUDIO_ENCODER_DEFAULT,
      sampleRate: 44100,
      numberOfChannels: 1,
      bitRate: 128000,
    },
    ios: {
      extension: '.wav',
      audioQuality: Audio.RECORDING_OPTION_IOS_AUDIO_QUALITY_HIGH,
      sampleRate: 44100,
      numberOfChannels: 1,
      bitRate: 128000,
      linearPCMBitDepth: 16,
      linearPCMIsBigEndian: false,
      linearPCMIsFloat: false,
    },
  }

  // 에러시 기존 레코딩 파일 삭제
  async function deleteRecordingFile() {
    try {
      const info = await FileSystem.getInfoAsync(recording.getURI())
      await FileSystem.deleteAsync(info.uri)
    } catch (error) {
      // console.log('There was an error deleting recorded file', error)
    }
  }

  // 녹음 시작
  async function _startRecording() {
    handleExplanation()
    await Audio.setAudioModeAsync({
      allowsRecordingIOS: true,
      interruptionModeIOS: Audio.INTERRUPTION_MODE_IOS_DO_NOT_MIX,
      playsInSilentModeIOS: true,
      interruptionModeAndroid: Audio.INTERRUPTION_MODE_ANDROID_DO_NOT_MIX,
      playThroughEarpieceAndroid: true,
    }); // <= important for IOS

    const newRrecording = new Audio.Recording();
    setRecording(newRrecording);

    await newRrecording.prepareToRecordAsync(
      recordingOptions
    );

    newRrecording.setOnRecordingStatusUpdate((status) =>
      setRecordingStatus(status)
    );

    await newRrecording.startAsync();
  }

  // 녹음 종료
  async function _stopRecording() {
    if (!recording) {
      // console.log("You are not recording.")
      return;
    }

    try {
      await recording.stopAndUnloadAsync();
      // console.log(`Recorded URI: ${recording.getURI()}`);
    } catch (error) {
      // Do nothing -- we are already unloaded.
    }
    // console.log(recording._uri)
    // 녹음 파일 재생을 위한 코드
    const info = await FileSystem.getInfoAsync(recording.getURI() || "");
    // console.log(info)
    
    await Audio.setAudioModeAsync({
      allowsRecordingIOS: false,
      interruptionModeIOS: Audio.INTERRUPTION_MODE_IOS_DO_NOT_MIX,
      playsInSilentModeIOS: true,
      shouldDuckAndroid: true,
      interruptionModeAndroid: Audio.INTERRUPTION_MODE_ANDROID_DO_NOT_MIX,
      playThroughEarpieceAndroid: false,
      staysActiveInBackground: true,
    });

    const { sound, status } = await recording.createNewLoadedSoundAsync(
      {
        isLooping: false,
        isMuted: muted,
        volume: volume,
        rate: rate,
        shouldCorrectPitch: shouldCorrectPitch,
      },
    );
    setSound(sound);
  }

  // 파일 전송
  async function getTranscription () {
    setIsFetching(true)
    try {
      // const { uri } = await FileSystem.getInfoAsync(recording.getURI())
      const audioBytes = await FileSystem.readAsStringAsync(recording.getURI(), {encoding:FileSystem.EncodingType.Base64});

      // const formData = new FormData()

      // formData.append('file', {
      //   uri,
      //   type: Platform.OS === 'ios' ? 'audio/x-wav' : 'audio/m4a',
      //   name: Platform.OS === 'ios' ? `${Date.now()}.wav` :`${Date.now()}.m4a`,
      // })


      const { data } = await axios.post(`https://speech.googleapis.com/v1p1beta1/speech:recognize?key=${API_KEY}`, {
        audio:{
          content:audioBytes
        },
        config:
        // {
        //   encoding:"LINEAR16",
        //   sampleRateHertz: 41000,
        //   languageCode: "ko-KR"
        // }
        Platform.OS==='ios'?{  
          encoding: "LINEAR16",
          // audioChannelCount:1,
          sampleRateHertz: 41000,
          languageCode: "ko-KR",
        }:{
          encoding: "MP3",
          sampleRateHertz: 41000,
          languageCode: "ko-KR"
        }
      })
      // console.log(data)
      // console.log(data.results)
      // console.log(data.results[0].alternatives[0].transcript)
      handleTranscript(data.results[0].alternatives[0].transcript)
    } catch (error) {
      // console.log(error)
      // console.log('There was an error reading file', error)
      // _stopRecording()
      // resetRecording()
    }
    setIsFetching(false)
  }

  

  // 녹음 초기화
  function resetRecording(){
    deleteRecordingFile()
    setRecording(null)
  }

  // 녹음 종료시
  function handleStopRecording() {
    // console.log('끝')
    _stopRecording()
    getTranscription()
  }

  async function soundPlay() {
    sound.playAsync()
  }

  return (
    <View style={r < 85 ? styles.container : styles.iPadContainer}>
      {/* <TouchableOpacity style={{marginTop:5}} onPress={handleTest}>
            <MaterialCommunityIcons name='microphone' size={35} color={'white'}/>
      </TouchableOpacity> */}
      <TouchableOpacity style={{marginTop:5}} onPressIn={_startRecording} onPressOut={handleStopRecording}>
            <MaterialCommunityIcons name='microphone' size={35} color={'white'}/>
      </TouchableOpacity>
      {/* <Button title="start record" onPress={_startRecording} /> */}
      {/* <Text>Open up App.tsx to start working on your app!</Text>

      <Button title="start record" onPress={_startRecording} />
      <Button title="stop record" onPress={handleStopRecording} />
      <Button title="play record" onPress={soundPlay}/>
      <View>
        <Text>Recording permission: {isAllowRecord} </Text>
        <Text style={{ fontSize: 15 }}>
          Can record: {recordingStatus?.canRecord ? "Yes" : "No"}
        </Text>
        <Text>Is recording: {recordingStatus?.isRecording ? "Yes" : "No"}</Text>
        <Text>
          Is done recording: {recordingStatus?.isDoneRecording ? "Yes" : "No"}
        </Text>
        <Text>Recording time: {recordingStatus?.durationMillis}</Text>
        <Text>Transcript: {transcript}</Text>
      </View>

      <StatusBar style="auto" /> */}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    position:"absolute",
    right:15,
    bottom:80,
    backgroundColor: "#1E388D",
    borderRadius: 25,
    width:50,
    height:50,
    shadowOpacity: 0.35,
    shadowOffset: {
      width: 0,
      height: 5
    },
    justifyContent:'center',
    alignItems:'center'
  },
  iPadContainer:{
    position:"absolute",
    right:30,
    bottom:180,
    backgroundColor: "#1E388D",
    borderRadius: 25,
    width:50,
    height:50,
    shadowOpacity: 0.35,
    shadowOffset: {
      width: 0,
      height: 5
    },
    justifyContent:'center',
    alignItems:'center'
  },
  button: {
    justifyContent: 'center',
    alignItems: 'center',
  }
});