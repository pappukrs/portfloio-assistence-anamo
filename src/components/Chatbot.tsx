'use client'
import { Canvas } from '@react-three/fiber';
import { MeshDistortMaterial, Sphere } from '@react-three/drei';
import { useConversation } from '@11labs/react';
import { useCallback } from 'react';
import dotenv from 'dotenv';

dotenv.config();

const agentId = process.env.NEXT_PUBLIC_AGENT_ID;
console.log('Agent ID:', agentId);

// Define the props and state types if needed

export default function Chatbot() {
  const conversation = useConversation({
    onConnect: () => console.log('Connected'),
    onDisconnect: () => console.log('Disconnected'),
    onMessage: (message: string) => console.log('Message:', message),
    onError: (error: Error) => console.error('Error:', error),
  });

  const startConversation = useCallback(async () => {
    try {
      // Request microphone permission
      await navigator.mediaDevices.getUserMedia({ audio: true });

      // Start the conversation with your agent
      await conversation.startSession({
        agentId: process.env.NEXT_PUBLIC_AGENT_ID, // Use the agent ID from .env
      });

    } catch (error) {
      console.error('Failed to start conversation:', error);
    }
  }, [conversation]);

  const stopConversation = useCallback(async () => {
    await conversation.endSession();
  }, [conversation]);

  return (
    <div className="h-screen flex flex-col items-center justify-center bg-gray-900 text-white p-4">
      <div className="text-center mb-4">
        <h1 className="text-4xl font-bold">Chatbot Interface</h1>
        <p className="text-gray-400">Interact using voice commands!</p>
      </div>
      
      <div className="w-full max-w-lg h-64">
        <Canvas>
          <ambientLight intensity={0.5} />
          <directionalLight position={[2, 2, 5]} />
          <Sphere args={[1, 100, 200]} scale={1.5}>
            <MeshDistortMaterial color="#61dafb" distort={0.5} speed={2} />
          </Sphere>
        </Canvas>
      </div>
      
      <div className="mt-8 text-center">
        <div className="flex justify-center gap-4">
          <button
            onClick={startConversation}
            disabled={conversation.status === 'connected'}
            className="bg-green-500 px-4 py-2 rounded-lg hover:bg-green-600"
          >
            Start Conversation
          </button>
          <button
            onClick={stopConversation}
            disabled={conversation.status !== 'connected'}
            className="bg-red-500 px-4 py-2 rounded-lg hover:bg-red-600"
          >
            Stop Conversation
          </button>
        </div>
        <p className="mt-4">Status: {conversation.status}</p>
        <p>Agent is {conversation.isSpeaking ? 'speaking' : 'listening'}</p>
      </div>
    </div>
  );
}
