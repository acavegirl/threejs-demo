import { useRef, useEffect } from 'react'
import * as Three from 'three'
import { sunMesh, earthMesh, moonMesh, solarSystem, earthOrbit, moonOribit, light, pointLightHelper } from '../utils/basicMatrial'

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
        camera.position.set(50, 50, 100)
        // camera.up.set(0, 0, 1)
        camera.lookAt(0, 0, 0)
        cameraRef.current = camera

        //创建场景
        const scene = new Three.Scene()
        scene.background = new Three.Color(0x111111)
        sceneRef.current = scene

        const axes = new Three.AxesHelper(20)
        axes.renderOrder = 1 // renderOrder 的该值默认为 0，这里设置为 1 ，目的是为了提高优先级，避免被物体本身给遮盖住
        scene.add(axes)



        //将太阳系、灯光添加到场景中
        // scene.add(sunMesh)
        // scene.add(earthMesh)
        // scene.add(moonMesh)
        scene.add(solarSystem)
        scene.add(light)
        

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