import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Scene, PerspectiveCamera, WebGLRenderer, BoxGeometry, MeshBasicMaterial, Mesh, MeshPhongMaterial, DirectionalLight, Vector3, BufferGeometry, LineBasicMaterial, Line } from 'three';

const pointsData = [[-10, 0, 0], [0, 10, 0], [10, 0, 0]]
const points = pointsData.map(item => new Vector3(...item))

export default () => {
  // 对dom的引用
  const canvasRef = useRef()

  const scene = useRef(new Scene())

  const geometry = useRef(new BufferGeometry().setFromPoints(points))
  const material = useRef(new LineBasicMaterial({ color: 0x0000ff }))
  const line = useRef(new Line(geometry.current, material.current))

  const camera = useRef(new PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000))

  const renderer = useRef()
  const resizeFnRef = useRef(() => {
    // 自适应之后重新设置镜头
    const canvas = renderer.current.domElement //获取 canvas
    camera.current.aspect = canvas.clientWidth / canvas.clientHeight // 设置镜头宽高比，第二个参数
    camera.current.updateProjectionMatrix() // 通知镜头更新视椎(视野)

    renderer.current.setSize(canvas.clientWidth, canvas.clientHeight, false)
    renderer.current.render(scene.current, camera.current)
  })

  useEffect(() => {
    scene.current.add(line.current)

    camera.current.position.set( 0, 0, 100 );
    camera.current.lookAt( 0, 0, 0 );
  }, [])

  useEffect(()=>{
    if (canvasRef.current){
      renderer.current = new WebGLRenderer({ canvas: canvasRef.current })
      renderer.current.render(scene.current, camera.current)


      window.addEventListener('resize', resizeFnRef.current) //添加窗口 resize 事件处理函数
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