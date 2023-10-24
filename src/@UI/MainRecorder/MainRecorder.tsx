import React, { FC, memo, useState,useEffect,useRef } from 'react'
import { ChevronRightIcon } from '@chakra-ui/icons';
import {
  Box,
  Icon,
  Theme,
  Button,
  useTheme,
  SimpleGrid,
  IconButton,
} from '@chakra-ui/react'
import { FaVideoSlash, FaDownload, FaCamera } from 'react-icons/fa'
import 'video-react/dist/video-react.css'
// @ts-ignore
import { Player } from 'video-react'
// @ts-ignore
import RecordRTC, {
  // @ts-ignore
  RecordRTCPromisesHandler,
} from 'recordrtc'
import { saveAs } from 'file-saver'
import axios from 'axios';

import Webcam from 'react-webcam';

// import RPPGGraph from './rppgGraph';

import '@babel/polyfill';


const MainRecorder: FC = () => {
  const theme: Theme = useTheme()
  const [recorder, setRecorder] = useState<RecordRTC | null>()
  const [stream, setStream] = useState<MediaStream | null>()
  const [videoBlob, setVideoUrlBlob] = useState<Blob | null>()
  const [type, setType] = useState<'video' | 'screen'>('video')
  
  //timer settings
  const intervalId = React.useRef<NodeJS.Timeout>();
  const coutdownIntervalId = React.useRef<NodeJS.Timeout>();
  const [countDown, setCountDown] = useState(30);
  const refCountDown = React.useRef(30);

  //live feed
  const webcamRef = React.useRef<any>(null);

  //variables for heart rate and rppg signals
  const [heartRate, setHeartRate] = useState<number | null>(null);
  const [rppgSignals, setRPPGSignals] = useState<number[] | null>(null);

  useEffect(
    () => () => {
      if (intervalId.current) {
        clearInterval(intervalId.current);
      }

      if (coutdownIntervalId.current) {
        clearInterval(coutdownIntervalId.current);
      }
    },
    []
  );

  const startRecording = async () => {
    const mediaDevices = navigator.mediaDevices;
    const stream: MediaStream =
    type === 'video'
    ? await mediaDevices.getUserMedia({
      video: true,
      audio: false,
    })
    : await (mediaDevices as any).getDisplayMedia({
      video: true,
      audio: false,
    })
    const recorder: RecordRTC = new RecordRTCPromisesHandler(stream, {
      type: 'video',
    })
    await recorder.startRecording()
    coutdownIntervalId.current = setInterval(() => {
      setCountDown(prevCount => prevCount - 1);
      refCountDown.current -= 1;
      if (refCountDown.current === 0) {
        stopRecording();
      }
    }, 1000);
    setRecorder(recorder)
    setStream(stream)
    setVideoUrlBlob(null)
  }

  const stopRecording = async () => {
    if (recorder) {
      if (intervalId.current) {
        clearInterval(intervalId.current);
      }
      if (coutdownIntervalId.current) {
        clearInterval(coutdownIntervalId.current);
      }
      console.log("rec stopped");
      
      setCountDown(30);
      refCountDown.current = 30;
  
      await recorder.stopRecording()
      const blob: Blob = await recorder.getBlob()
      ;(stream as any).stop()
      setVideoUrlBlob(blob)
      setStream(null)
      setRecorder(null)
    }
  }

  const downloadVideo = () => {
    if (videoBlob) {
      const mp4File = new File([videoBlob], 'demo.mp4', { type: 'video/mp4' })
      saveAs(mp4File, `Video-${Date.now()}.mp4`)
      // saveAs(videoBlob, `Video-${Date.now()}.webm`)
    }
  }


  const sendVideoToBackend = async () => {
    try {
      if (videoBlob) {
        const formData = new FormData();
        formData.append('video', videoBlob);
        
        // Make a POST request to your backend server using the full URL
        const response = await axios.post('http://localhost:5000/upload-video', formData);
        
        // Handle the response from the server (a JSON object)
        console.log('Response from server:', response.data);
        setHeartRate(response.data.heartRate);
        setRPPGSignals(response.data.rppgSignals);
      }
    } catch (error) {
      console.error('Error sending video to the backend:', error);
    }
  };


  return (
    <SimpleGrid spacing="5" p="5">
      <Box
        display="flex"
        justifyContent="center"
        flexDirection={[
          'column', // 0-30em
          'row', // 30em-48em
          'row', // 48em-62em
          'row', // 62em+
        ]}
      >
        <IconButton
          m="1"
          bg={theme.colors.blue[600]}
          size="lg"
          aria-label="start recording"
          color="white"
          onClick={startRecording}
          icon={<Icon as={FaCamera} />}
        />
        <IconButton
          m="1"
          bg={theme.colors.blue[600]}
          size="lg"
          color="white"
          aria-label="stop recording"
          onClick={stopRecording}
          disabled={recorder ? false : true}
          icon={<Icon as={FaVideoSlash} />}
        />
        <IconButton
          bg={theme.colors.blue[600]}
          m="1"
          size="lg"
          disabled={!!!videoBlob}
          color="white"
          onClick={downloadVideo}
          aria-label="download video"
          icon={<Icon as={FaDownload} />}
        />
        <IconButton
        bg={theme.colors.blue[600]}
        m="1"
        size="lg"
        color="white"
        onClick={sendVideoToBackend}
        aria-label="Send Video"
        icon={<Icon as={ChevronRightIcon} />}
      />

      </Box>
      <Box display="flex" justifyContent="center">
        <Box
          bg='inherit'
          h="50vh"
          width={[
            '100%', // 0-30em
            '100%', // 30em-48em
            '50vw', // 48em-62em
            '50vw', // 62em+
          ]}
        >
          
          <Box
            bg="white"
            borderRadius="10px"
            px="5"
            py="2"
            fontSize="20px"
            fontWeight="bold"
          >
            Remaining time: {countDown} seconds
          </Box>

          <div style={{ width: '500px', height: '500px' }}>
            {
              !videoBlob ? (
                <Webcam
                  width={500}
                  height={500}
                  mirrored={false}
                  audio={false}
                  ref={webcamRef}
                  screenshotFormat="image/jpeg"
                />
              ) : (
                <Player
                  width={500}
                  height={500}
                  src={window.URL.createObjectURL(videoBlob)}
                />
              )
            }
          </div>
          {/* {rppgData.length > 0 && (
            <RPPGGraph rppgData={rppgData} />
          )} */}
        </Box>
      </Box>
    </SimpleGrid>
  )
}

export default memo(MainRecorder)