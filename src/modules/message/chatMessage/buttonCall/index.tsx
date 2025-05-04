// 'use client';
// import { Modal } from 'antd';
// import React, { useEffect, useRef, useState } from 'react';
// import AgoraRTC, { IAgoraRTCClient, IAgoraRTCRemoteUser } from 'agora-rtc-sdk-ng';
// import { useSocket } from '~/provider/socketProvider';

// const APP_ID = process.env.PUBLIC_AGORA_APP_ID; // Add your Agora App ID in .env

// const VideoCallModal = ({ friendId, userId }: { friendId: string; userId: string }) => {
//   const socket = useSocket();
//   const localVideoRef = useRef<HTMLDivElement>(null);
//   const remoteVideoRef = useRef<HTMLDivElement>(null);
//   const [isCalling, setIsCalling] = useState(false);
//   const [hasIncomingCall, setHasIncomingCall] = useState(false);
//   const [isWaitingForAcceptance, setIsWaitingForAcceptance] = useState(false);
//   const [callerId, setCallerId] = useState<string | null>(null);
//   const [modalVisible, setModalVisible] = useState(false);
//   const [client, setClient] = useState<IAgoraRTCClient | null>(null);
//   const [localTracks, setLocalTracks] = useState<any[]>([]);

//   useEffect(() => {
//     if (!socket) return;

//     socket.on('incomingCall', (data) => {
//       setHasIncomingCall(true);
//       setCallerId(data.from);
//       setModalVisible(true);
//     });

//     socket.on('acceptCall', async (data) => {
//         console.log('Accepting call from:', data.from);
//       setIsWaitingForAcceptance(false);
//       await joinChannel(data.channel);
//     });

//     socket.on('rejectCall', () => {
//       if (isWaitingForAcceptance) {
//         setIsWaitingForAcceptance(false);
//         setModalVisible(false);
//       }
//     });

//     socket.on('callCancelled', () => {
//       if (hasIncomingCall) {
//         setHasIncomingCall(false);
//         setCallerId(null);
//         setModalVisible(false);
//       }
//     });

//     socket.on('endCall', () => {
//       if (isCalling) {
//         leaveChannel();
//         setIsCalling(false);
//         setModalVisible(false);
//       }
//     });

//     return () => {
//       socket.off('incomingCall');
//       socket.off('acceptCall');
//       socket.off('rejectCall');
//       socket.off('callCancelled');
//       socket.off('endCall');
//     };
//   }, [socket]);

//   const joinChannel = async (channel: string) => {
//     console.log('Joining channel:', channel);
//     const agoraClient = AgoraRTC.createClient({ mode: 'rtc', codec: 'vp8' });
//     setClient(agoraClient);

//     await agoraClient.join(APP_ID ?? '', channel, null, userId);

//     const [microphoneTrack, cameraTrack] = await AgoraRTC.createMicrophoneAndCameraTracks();
//     setLocalTracks([microphoneTrack, cameraTrack]);

//     if (localVideoRef.current) {
//       cameraTrack.play(localVideoRef.current);
//     }

//     await agoraClient.publish([microphoneTrack, cameraTrack]);

//     agoraClient.on('user-published', async (user: IAgoraRTCRemoteUser, mediaType: string) => {
//       await agoraClient.subscribe(user, mediaType);
//       if (mediaType === 'video' && remoteVideoRef.current) {
//         user.videoTrack?.play(remoteVideoRef.current);
//       }
//       if (mediaType === 'audio') {
//         user.audioTrack?.play();
//       }
//       setIsCalling(true);
//     });

//     agoraClient.on('user-unpublished', (user: IAgoraRTCRemoteUser, mediaType: string) => {
//       if (mediaType === 'video' && remoteVideoRef.current) {
//         remoteVideoRef.current.innerHTML = '';
//       }
//     });
//   };

//   const leaveChannel = async () => {
//     if (client) {
//       await client.leave();
//       localTracks.forEach((track) => track.close());
//       setClient(null);
//       setLocalTracks([]);
//     }
//   };

//   const startCall = () => {
//     const channel = `channel_${userId}_${friendId}`;
//     socket?.emit('callRequest', { to: friendId, channel });
//     setIsWaitingForAcceptance(true);
//     setModalVisible(true);
//   };

//   const acceptCall = () => {
//     if (callerId) {
//       const channel = `channel_${callerId}_${userId}`;
//       socket?.emit('acceptCall', { to: callerId, channel });
//       joinChannel(channel);
//       setHasIncomingCall(false);
//     }
//   };

//   const endCall = () => {
//     if (hasIncomingCall) {
//       socket?.emit('rejectCall', { to: callerId });
//       setHasIncomingCall(false);
//       setCallerId(null);
//     } else if (isWaitingForAcceptance) {
//       socket?.emit('cancelCall', { to: friendId });
//       setIsWaitingForAcceptance(false);
//     } else if (isCalling) {
//       socket?.emit('endCall', { to: friendId || callerId });
//       leaveChannel();
//       setIsCalling(false);
//     }
//     setModalVisible(false);
//   };

//   return (
//     <div>
//       <button onClick={startCall} disabled={isCalling || hasIncomingCall || isWaitingForAcceptance}>
//         Gọi video
//       </button>
//       <Modal
//         title="Video Call"
//         open={modalVisible}
//         onCancel={endCall}
//         footer={null}
//         width={800}
//         centered
//         destroyOnClose
//       >
//         <div style={{ display: 'flex', justifyContent: 'space-around' }}>
//           <div ref={localVideoRef} style={{ width: '300px', height: '200px' }} />
//           <div ref={remoteVideoRef} style={{ width: '300px', height: '200px' }} />
//         </div>
//         <div style={{ marginTop: '20px', textAlign: 'center' }}>
//           {hasIncomingCall && (
//             <>
//               <p>Cuộc gọi từ {callerId}</p>
//               <button onClick={acceptCall} style={{ marginRight: '10px' }}>
//                 Trả lời
//               </button>
//               <button onClick={endCall}>Từ chối</button>
//             </>
//           )}
//           {isWaitingForAcceptance && (
//             <>
//               <p>Đang gọi cho {friendId}</p>
//               <button onClick={endCall}>Hủy</button>
//             </>
//           )}
//           {isCalling && <button onClick={endCall}>Kết thúc</button>}
//         </div>
//       </Modal>
//     </div>
//   );
// };

// export default VideoCallModal;
