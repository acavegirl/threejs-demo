import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Scene, PerspectiveCamera, WebGLRenderer, BoxGeometry, MeshBasicMaterial, Mesh, MeshPhongMaterial, DirectionalLight, Vector3, BufferGeometry, LineBasicMaterial, Line, CapsuleGeometry, CircleGeometry, ConeGeometry, CylinderGeometry, EdgesGeometry, LineSegments, WireframeGeometry, Box3, Box3Helper, TextureLoader } from 'three';

import imgSrc from '../assets/imgs/mapping.jpg' //引入图片资源

export default () => {
  // 对dom的引用
  const canvasRef = useRef()
  const sceneRef = useRef()
  const cameraRef = useRef()
  const rendererRef = useRef()

  

  // 初始化
  const createInit = useCallback(() => {
    if (canvasRef.current === null) {
        return
    }

    //初始化场景
    const scene = new Scene()

    //初始化镜头
    const camera = new PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000)
    camera.position.set(0, 0, 50)
    

    //初始化渲染器
    const renderer = new WebGLRenderer({ canvas: canvasRef.current })
    

    //添加 2 盏灯光
    const light0 = new DirectionalLight(0xFFFFFF, 1)
    light0.position.set(-1, 2, 4)
    scene.add(light0)

    const light1 = new DirectionalLight(0xFFFFFF, 1)
    light1.position.set(1, -2, -4)
    scene.add(light1)


    const boxGeo = new BoxGeometry(5, 5, 5)
    // const material = new MeshPhongMaterial({ color: 0x00ff00})
    //创建一个 纹理加载器
    const loader = new TextureLoader()
    //创建一个材质，材质的 map 属性值为 纹理加载器加载的图片资源
    const material = new MeshPhongMaterial({
        map: loader.load(imgSrc) //loader.load('xxx.jpg')返回值为Three.Text类型实例
    })
    const mesh = new Mesh(boxGeo, material)
    scene.add(mesh)
    

    sceneRef.current = scene
    cameraRef.current = camera
    rendererRef.current = renderer

    //添加自动旋转渲染动画
    const renderFn = (time) => {
        time = time * 0.001
        mesh.rotation.x = time
        mesh.rotation.y = time

        rendererRef.current.render(sceneRef.current, cameraRef.current)
        window.requestAnimationFrame(renderFn)
    }
    window.requestAnimationFrame(renderFn)
  }, [canvasRef])

  const resizeHandle = () => {
    //根据窗口大小变化，重新修改渲染器的视椎
    if (rendererRef.current === null || cameraRef.current === null) {
      return
    }

    const canvas = rendererRef.current.domElement
    cameraRef.current.aspect = canvas.clientWidth / canvas.clientHeight
    cameraRef.current.updateProjectionMatrix()
    rendererRef.current.setSize(canvas.clientWidth, canvas.clientHeight, false)
  }

  useEffect(() => {
    if (canvasRef.current) {
      createInit()
      resizeHandle()
      window.addEventListener('resize', resizeHandle)
      return () => {
          window.removeEventListener('resize', resizeHandle)
      }
    }
}, [canvasRef, createInit])

  return (<>
    <canvas ref={canvasRef} />
  </>)
}