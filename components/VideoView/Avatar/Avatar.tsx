import { useGLTF } from "@react-three/drei";
import { Category } from "@mediapipe/tasks-vision";
import { Euler } from "three";
import { useFrame, useGraph } from "@react-three/fiber";
import { useEffect, useRef } from "react";

export interface AvatarProps {
  url: string;
  blendshapes: Category[] | undefined | null; // Assuming blendshapes is an array of objects
  rotation: Euler | undefined | null;
  position: number[];
  // headMesh: any[] | undefined;
}

export function Avatar({ url, blendshapes, rotation, position }: AvatarProps) {
  const { scene } = useGLTF(url);
  const { nodes } = useGraph(scene);
  const headMeshRef = useRef<any[]>([]);

  useEffect(() => {
    if (nodes.Wolf3D_Head) headMeshRef.current.push(nodes.Wolf3D_Head);
    if (nodes.Wolf3D_Teeth) headMeshRef.current.push(nodes.Wolf3D_Teeth);
    if (nodes.Wolf3D_Beard) headMeshRef.current.push(nodes.Wolf3D_Beard);
    if (nodes.Wolf3D_Avatar) headMeshRef.current.push(nodes.Wolf3D_Avatar);
    if (nodes.Wolf3D_Head_Custom)
      headMeshRef.current.push(nodes.Wolf3D_Head_Custom);
  }, [nodes, url]);

  useFrame(() => {
    if (blendshapes && blendshapes.length > 0) {
      blendshapes.forEach((element) => {
        headMeshRef.current.forEach((mesh) => {
          let index = mesh.morphTargetDictionary[element.categoryName];
          if (index >= 0) {
            mesh.morphTargetInfluences[index] = element.score;
          }
        });
      });
      if (rotation !== undefined && rotation !== null) {
        nodes.Head.rotation.set(rotation.x, rotation.y, rotation.z);
        nodes.Neck.rotation.set(
          rotation.x / 5 + 0.3,
          rotation.y / 5,
          rotation.z / 5
        );
        nodes.Spine2.rotation.set(
          rotation.x / 10,
          rotation.y / 10,
          rotation.z / 10
        );
      }
    }
  });

  return <primitive object={scene} position={position} scale={[-1, 1, 1]} />;
}
