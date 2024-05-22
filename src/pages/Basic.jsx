import React, { useState, useEffect, useRef } from 'react';
import { Scene, PerspectiveCamera, WebGLRenderer, BoxGeometry, MeshBasicMaterial, Mesh, MeshPhongMaterial, DirectionalLight } from 'three';


export default () => {
  // 对dom的引用
  const canvasRef = useRef()

  useEffect(()=>{
    if (canvasRef.current){
      // scene
      const scene = new Scene()


      // geometry, material, mesh
      const geometry = new BoxGeometry(1, 1, 1)
      // const material = new MeshBasicMaterial({ color: 0x00ff00 })
      const material = new MeshPhongMaterial({ color: 0x00ff00 })
      const cube = new Mesh(geometry, material)
      // scene + mesh
      scene.add(cube)


      //创建光源
      const light = new DirectionalLight(0xFFFFFF, 1)
      light.position.set(-1, 2, 4)
      scene.add(light)//将光源添加到场景中，若场景中没有任何光源，则可反光材质的物体渲染出的结果是一片漆黑，什么也看不见


      // camera
      const camera = new PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000)
      // 设置透视镜头的Z轴距离
      camera.position.z = 5;

      // renderer
      const renderer = new WebGLRenderer({ canvas: canvasRef.current })
      // renderer.render(scene, camera)
      // 添加自动旋转渲染动画
      const render = (time: number) => {
          time = time * 0.001 //原本 time 为毫秒，我们这里对 time 进行转化，修改成 秒，以便于我们动画旋转角度的递增
          cube.rotation.x = time
          cube.rotation.y = time
          renderer.render(scene, camera)
          window.requestAnimationFrame(render)
      }
      window.requestAnimationFrame(render)

    }
  }, [canvasRef])

  return (<>
    <canvas ref={canvasRef} />
  </>)
}