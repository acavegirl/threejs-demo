import React, { useState, useEffect, useRef } from 'react';
import { Scene, PerspectiveCamera, WebGLRenderer, BoxGeometry, MeshBasicMaterial, Mesh, MeshPhongMaterial, DirectionalLight } from 'three';


export default () => {
  // 对dom的引用
  const canvasRef = useRef()
  const resizeFnRef = useRef()


  useEffect(()=>{
    console.log(window.devicePixelRatio)
    if (canvasRef.current){
      // scene
      const scene = new Scene()


      // geometry, material, mesh
      const geometry = new BoxGeometry(1, 1, 1)
      // const material = new MeshBasicMaterial({ color: 0x00ff00 })
      const material = new MeshPhongMaterial({ color: 0x00ff00 })
      const cube = new Mesh(geometry, material)
      cube.position.x = -2

      const cube1 = new Mesh(geometry, material)
      cube1.position.x = 0
      cube1.position.y = 2
      
      const cube2 = new Mesh(geometry, material)
      cube2.position.x = 3
      // scene + mesh
      scene.add(cube, cube1, cube2)


      //创建光源
      const light = new DirectionalLight(0xFFFFFF, 1)
      light.position.set(-10, 10, 100)
      scene.add(light)//将光源添加到场景中，若场景中没有任何光源，则可反光材质的物体渲染出的结果是一片漆黑，什么也看不见


      // camera
      const camera = new PerspectiveCamera(100, window.innerWidth / window.innerHeight, 0.1, 1000)
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

      const resizeFn = () => {
        // 自适应之后重新设置镜头
        const canvas = renderer.domElement //获取 canvas
        camera.aspect = canvas.clientWidth / canvas.clientHeight // 设置镜头宽高比，第二个参数
        camera.updateProjectionMatrix() // 通知镜头更新视椎(视野)

        // 修改渲染尺寸大小，第3个参数为可选参数，默认值为 true，false 意思是阻止因渲染内容尺寸发生变化而去修改 canvas 尺寸
        renderer.setSize(canvas.clientWidth, canvas.clientHeight, false)
      }
      resizeFn()
      resizeFnRef.current = resizeFn

      window.addEventListener('resize', resizeFn) //添加窗口 resize 事件处理函数
      return () => {
        if (resizeFnRef.current) {
          window.removeEventListener('resize', resizeFnRef.current)
        }
      }

    }
  }, [canvasRef])

  return (<>
    <canvas ref={canvasRef} />
  </>)
}