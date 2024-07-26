'use client'; // Certifique-se de que este é um Client Component

import React, { useEffect, useState } from "react";
import { Image, OrderImage, Post, Vehicle } from '../../lib/definitions';
import Link from "next/link";
import { saveSelection } from './serverActions';
import { alterOrderImageId } from "@/app/lib/data";
import { PopupOrder } from "./popupOrder";
import sharp from 'sharp';
import { NextResponse } from "next/server";
import { useRouter } from "next/navigation";
import { getSession, useSession } from "next-auth/react";


export function selectedImagesAtualize(selectedImages : OrderImage[],order: OrderImage) {
  const existingIndex = selectedImages.findIndex((selected) => selected.imageId === order.imageId);

  if (existingIndex !== -1) {
    // Se já está selecionada, atualizar suas propriedades ou remover
    const updatedSelection = [...selectedImages];
    const existingOrder = updatedSelection[existingIndex];

    // Atualize as propriedades conforme necessário
    updatedSelection[existingIndex] = {
      ...existingOrder,
      requestImage: !existingOrder.requestImage, // alternar o valor booleano
    };

    return updatedSelection;
  } else {
    // Se não está selecionada, marcar
    // console.log("🚀 ~ setSelectedImages ~ order:", order)
    order.requestImage = !order.requestImage;
    console.log("a ~ setSelectedImages ~ order:", order)
  
    return [...selectedImages, order];
  }
}

const getWatermarkedImageUrl = (imageUrl) => {
  return `/api/watermark?imageUrl=${encodeURIComponent(imageUrl)}`;
};


export function ListImagemViewer({ dataPost}) {
  const [selectedImages, setSelectedImages] = useState<OrderImage[]>([]);
  const [serverResponse, setServerResponse] = useState(null); // Estado para armazenar a resposta do servidor

  const router = useRouter();
  //const { data: session, status } = useSession();
 // let selectedImages : OrderImage[] = []

 const [session, setSession] = useState(null);
 

 useEffect(() => {
   const fetchSession = async () => {
     const session = await getSession();
     setSession(session);

   };
   fetchSession();
 }, []);

  // Função para lidar com a seleção de imagem
  const toggleImageSelection = (order: OrderImage) => {
    console.log("🚀 ~ toggleImageSelection ~ order:")
    let listS = selectedImagesAtualize(selectedImages, order)

    setSelectedImages(listS)

     
    
  };

    // Função para lidar com o clique do botão e chamar a função do servidor
    const handleSaveSelection = async () => {
       console.log("Respos")
      const response = await alterOrderImageId(selectedImages);
      setServerResponse(response); // Armazena a resposta do servidor no estado
      console.log("Resposta do servidor:", response); // Log para depuração
    };
  
    // Função para fechar o popup
    const closePopup = () => {
      setServerResponse(null);
      router.push('/clientspace/order/'+session.user.id);
    };
  

  const validateList = (order: OrderImage) => {
    const existing = selectedImages.find((selected) => selected.imageId === order.imageId);
    if (existing) {
      console.log("🚀🚀🚀🚀 ~ validateList ~ existing.requestImage:", existing.requestImage)
      return existing.requestImage
    }
     
    else{
      console.log("🚀 ~ validateList ~ order.requestImage:", order.requestImage)
      return order.requestImage
    }
      
  }

  return (
    <div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mt-8">
        {dataPost.orderImages.length === 0 ? (
          <p>Sem Imagens</p>
        ) : (
          (dataPost.orderImages as OrderImage[]).map((orderImage: OrderImage) => (
            <div
            key={orderImage.id}
            className={`col-span-1 ${validateList(orderImage) ? "border-4 border-blue-500" : ""}`} // Estilo para imagem selecionada
            onClick={() => toggleImageSelection(orderImage)}
            style={{ position: 'relative' }} // Torna o contêiner da imagem um contexto de posicionamento
          >
            <img
              src={getWatermarkedImageUrl(orderImage.image.pathURL)}
              alt={orderImage.image.title}
              className="rounded-md w-full object-cover cursor-pointer"
            />
            
          </div>
          
          ))
        )}
      </div>

      {
       !dataPost.processing && selectedImages.length > 0 ?       
       <div className="flex justify-end mt-8">
        <button
          onClick={handleSaveSelection}
          className="bg-orange-700 hover:bg-orange-900 text-white font-bold py-2 px-4 rounded"
        >
          Salvar Seleção
        </button>
            </div> : ""
      }

     
      {serverResponse && (
        <PopupOrder
          titulo="Agradecemos pela Escolha!"
          message="Seleção Enviadada com Sucesso! " // Mensagem que será exibida no popup
          message2="Você pode acompanhar o Andamento:" 
          message3="Pelo SITE ou nosso WHATSAPP." 
          onClose={closePopup} // Função para fechar o popup
        />
      )}
    </div>
  );
}
