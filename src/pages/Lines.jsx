import React, { useState, useEffect, useRef } from 'react';
import { Scene, PerspectiveCamera, WebGLRenderer, BoxGeometry, MeshBasicMaterial, Mesh, MeshPhongMaterial, DirectionalLight, Vector3, BufferGeometry, LineBasicMaterial, Line } from 'three';


export default () => {
  // 对dom的引用
  const canvasRef = useRef()
  const resizeFnRef = useRef()

  useEffect(()=>{
    if (canvasRef.current){
      // scene
      const scene = new Scene()


      // geometry, material, line
      const pointsData = [[-10, 0, 0], [0, 10, 0], [10, 0, 0]]
      const points = pointsData.map(item => new Vector3(...item))
      const geometry = new BufferGeometry().setFromPoints(points)

      const material = new LineBasicMaterial({ color: 0x0000ff })

      const line = new Line(geometry, material)
      scene.add(line)


      // camera
      const camera = new PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000)
      // 设置透视镜头的Z轴距离
      // camera.position.z = 20;
      camera.position.set( 0, 0, 100 );
      camera.lookAt( 0, 0, 0 );

      // renderer
      const renderer = new WebGLRenderer({ canvas: canvasRef.current })
      renderer.render(scene, camera)

      const resizeFn = () => {
        // console.log("resizeFn")
        // 自适应之后重新设置镜头
        const canvas = renderer.domElement //获取 canvas
        camera.aspect = canvas.clientWidth / canvas.clientHeight // 设置镜头宽高比，第二个参数
        camera.updateProjectionMatrix() // 通知镜头更新视椎(视野)

        // 修改渲染尺寸大小，第3个参数为可选参数，默认值为 true，false 意思是阻止因渲染内容尺寸发生变化而去修改 canvas 尺寸
        renderer.setSize(canvas.clientWidth, canvas.clientHeight, false)
        renderer.render(scene, camera)
      }

      resizeFn()
      resizeFnRef.current = resizeFn

      renderer.render(scene, camera)


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