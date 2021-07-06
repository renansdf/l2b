/*global AFRAME*/

import React, { createContext, useState, useContext } from 'react';

interface IObject3D {
  position: any;
  rotation: any;
}

interface ClosedCameraContextData {
  cameraCloseIn: (endPosition: any) => void;
  cameraReturnNavigation: () => void;
  setCamera: (camera: any) => void;
}

const ClosedCamera = createContext<ClosedCameraContextData>({} as ClosedCameraContextData)

const ClosedCameraProvider: React.FC = ({children}) => {
  const [isReading, setIsReading] = useState(false);
  const [currentCloseIn, setCurrentCloseIn] = useState<IObject3D>({position: false, rotation: false});
  const [camera, setCamera] = useState<any>();

  const THREE = AFRAME.THREE;

  function getPose(object3D: IObject3D) {
    let pose = {
      position: new THREE.Vector3().set(object3D.position.x, object3D.position.y, object3D.position.z),
      rotation: new THREE.Vector3().set(object3D.rotation.x, object3D.rotation.y, object3D.rotation.z)
    }
  
    return pose
  }

  function getCameraPoseObject3D() {
    let obi3D = {
      position: {
        x: camera.object3D.position.x,
        y: camera.object3D.position.y,
        z: camera.object3D.position.z,
      },
      rotation: {
        x: camera.components['touch-look-controls'].pitchObject.rotation.x,
        y: camera.components['touch-look-controls'].yawObject.rotation.y,
        z: 0
      }
    }

    return obi3D;
  }

  const animateCamera = (object3D?: any) => {
    if(isReading) return
    setIsReading(true)
    
    let startPose = getCameraPoseObject3D()
    let endPose: any
    const animationData = { percent: 0 }
    
    if(object3D){
      endPose = getPose(object3D)
      setCurrentCloseIn(startPose)
    } else {
      endPose = currentCloseIn;
    }

    AFRAME.ANIME({
      targets: animationData,
      percent: 1,
      duration: 1500,
      easing: 'linear',
      begin: function() {
        // ToggleMouseLookComponent(false)
        // FadeCurrentHotspot(false)

        // lastAnimationTimestamp = new Date()
      },
      update: function() {
        const deltaPosition = new THREE.Vector3().lerpVectors(startPose.position, endPose.position, animationData.percent)
        const deltaRotation = new THREE.Vector3().lerpVectors(startPose.rotation, endPose.rotation, animationData.percent)

        camera && 
        camera.object3D.position.set(deltaPosition.x, deltaPosition.y, deltaPosition.z);
        camera.components['touch-look-controls'].pitchObject.rotation.x = deltaRotation.x;
        camera.components['touch-look-controls'].yawObject.rotation.y = deltaRotation.y;
      },
      complete: function() {
        setIsReading(false)
      }
    })
  }

  const cameraCloseIn = (endPosition: any) => {
    animateCamera(endPosition);
  }
  const cameraReturnNavigation = () => {
    animateCamera();
  }

  return (
    <ClosedCamera.Provider value={{cameraCloseIn, cameraReturnNavigation, setCamera}}>
      {children}
    </ClosedCamera.Provider>
  )
}

function useClosedCamera(): ClosedCameraContextData {
  const context = useContext(ClosedCamera);

  if (!context) {
    throw new Error('The context must be used within an Sidebar Provider');
  }

  return context;
}

export { useClosedCamera, ClosedCameraProvider }