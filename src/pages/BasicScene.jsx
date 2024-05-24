import { useRef, useEffect } from 'react'
import * as Three from 'three'
import { solarSystem, earthOrbit, moonOribit, pointLight, pointLightHelper } from '../utils/index'

const nodeArr = [solarSystem, earthOrbit, moonOribit] //太阳、地球、月亮对应的网格

export default () => {

    const canvasRef = useRef(null)
    const rendererRef = useRef(null)
    const cameraRef = useRef(null)
    const sceneRef = useRef(null)

    useEffect(() => {

        //创建渲染器
        const renderer = new Three.WebGLRenderer({ canvas: canvasRef.current})
        rendererRef.current = renderer

        //创建镜头
        const camera = new Three.PerspectiveCamera(40, window.innerWidth / window.innerHeight, 0.1, 1000)
        // camera.position.set(0, 50, 0)
        camera.position.set(40, 40, 50)
        // camera.up.set(0, 0, 1)
        camera.lookAt(0, 0, 0)
        cameraRef.current = camera

        //创建场景
        const scene = new Three.Scene()
        scene.background = new Three.Color(0x111111)
        sceneRef.current = scene

        //将太阳系、灯光添加到场景中
        scene.add(solarSystem)
        // scene.add(pointLight)
        // const pointLightHelper = new Three.PointLightHelper( pointLight, 20 );
        // scene.add( pointLightHelper );

        //显示轴线
        nodeArr.forEach((item) => {
          const axes = new Three.AxesHelper()
          const material = axes.material
          material.depthTest = false
          axes.renderOrder = 1 // renderOrder 的该值默认为 0，这里设置为 1 ，目的是为了提高优先级，避免被物体本身给遮盖住
          item.add(axes)
        })

        //创建循环渲染的动画
        const render = (time: number) => {
            time = time * 0.001
            nodeArr.forEach((item) => {
                item.rotation.y = time
            })
            renderer.render(scene, camera)
            window.requestAnimationFrame(render)
        }
        window.requestAnimationFrame(render)

        //添加窗口尺寸变化的监听
        const resizeHandle = () => {
            const canvas = renderer.domElement
            camera.aspect = canvas.clientWidth / canvas.clientHeight
            camera.updateProjectionMatrix()
            renderer.setSize(canvas.clientWidth, canvas.clientHeight, false)
        }
        resizeHandle()
        window.addEventListener('resize', resizeHandle)

        return () => {
            window.removeEventListener('resize', resizeHandle)
        }
    }, [canvasRef])

    return (
        <canvas ref={canvasRef} />
    )
}