import { useEffect, useRef, useState } from 'react'
import * as Three from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls'
//import { RectAreaLightUniformsLib } from 'three/examples/jsm/lights/RectAreaLightUniformsLib'
import { RectAreaLightHelper } from 'three/examples/jsm/helpers/RectAreaLightHelper'

import createScene, { MaterialType } from '../utils/creatScene.js'



const LightType = {
    AmbientLight : 'AmbientLight',
    AmbientLightProbe : 'AmbientLightProbe',
    DirectionalLight : 'DirectionalLight',
    HemisphereLight : 'HemisphereLight',
    HemisphereLightProbe : 'HemisphereLightProbe',
    PointLight : 'PointLight',
    RectAreaLight : 'RectAreaLight',
    SpotLight : 'SpotLight'
}

const buttonLabels = [LightType.AmbientLight, LightType.AmbientLightProbe, LightType.DirectionalLight,
LightType.HemisphereLight, LightType.HemisphereLightProbe, LightType.PointLight,
LightType.RectAreaLight, LightType.SpotLight]

export default () => {

    const canvasRef = useRef(null)
    const sceneRef = useRef(null)

    const [type, setType] = useState(LightType.AmbientLight)

    useEffect(() => {

        if (canvasRef.current === null) {
            return
        }

        const renderer = new Three.WebGLRenderer({ canvas: canvasRef.current})

        const camera = new Three.PerspectiveCamera(50, 2, 0.1, 1000)
        camera.position.set(0, 0, 60)

        const controls = new OrbitControls(camera, canvasRef.current)
        controls.target.set(0, 0, 0)
        controls.update()

        const scene = createScene()
        sceneRef.current = scene

        const render = () => {
            if (sceneRef.current) {
                renderer.render(sceneRef.current, camera)
            }
            window.requestAnimationFrame(render)
        }
        window.requestAnimationFrame(render)

        const handleResize = () => {
            const canvas = canvasRef.current
            if (canvas === null) {
                return
            }
            camera.aspect = canvas.clientWidth / canvas.clientHeight
            camera.updateProjectionMatrix()
            renderer.setSize(canvas.clientWidth, canvas.clientHeight, false)
        }
        handleResize()
        window.addEventListener('resize', handleResize)

        return () => {
            window.removeEventListener('resize', handleResize)
        }
    }, [canvasRef])

    useEffect(() => {
        if (sceneRef.current === null) {
            return
        }

        sceneRef.current = null

        let newScene
        if (type === LightType.RectAreaLight) {
            newScene = createScene(MaterialType.MESH_STANDARD_MATERIAL)
        } else {
            newScene = createScene()
        }
        sceneRef.current = newScene

        switch (type) {
            case LightType.AmbientLight:
                const ambientLight = new Three.AmbientLight(0xFFFFFF, 1)
                newScene.add(ambientLight)
                break
            // case LightType.AmbientLightProbe:
            //     const ambientLightProbe = new Three.AmbientLightProbe(0xFFFFFF, 1)
            //     newScene.add(ambientLightProbe)
            //     break
            case LightType.DirectionalLight:
                const directionalLight = new Three.DirectionalLight(0xFFFFFF, 1)
                directionalLight.position.set(0, 10, 0);
                directionalLight.target.position.set(-5, 0, 0)
                newScene.add(directionalLight)
                newScene.add(directionalLight.target)

                const directionalLightHelper = new Three.DirectionalLightHelper(directionalLight)
                newScene.add(directionalLightHelper)
                break
            case LightType.HemisphereLight:
                const hemisphereLight = new Three.HemisphereLight(0xB1E1FF, 0xB97A20, 1)
                newScene.add(hemisphereLight)

                const hemisphereLightHelper = new Three.HemisphereLightHelper(hemisphereLight,5)
                newScene.add(hemisphereLightHelper)

                break
            // case LightType.HemisphereLightProbe:
            //     const hemisphereLightProbe = new Three.HemisphereLightProbe(0xB1E1FF, 0xB97A20, 1)
            //     newScene.add(hemisphereLightProbe)
            //     break
            case LightType.PointLight:
                const pointLight = new Three.PointLight(0xFFFFFF, 1)
                pointLight.position.set(0, 10, 0)
                newScene.add(pointLight)

                const pointLightHelper = new Three.PointLightHelper(pointLight)
                newScene.add(pointLightHelper)
                break;
            case LightType.RectAreaLight:
                //RectAreaLightUniformsLib.init() //实际测试时发现即使不添加这行代码，场景似乎也依然正常渲染，没有看出差异

                const rectAreaLight = new Three.RectAreaLight(0xFFFFFF, 5, 12, 4)
                rectAreaLight.position.set(0, 10, 0)
                rectAreaLight.rotation.x = Three.MathUtils.degToRad(-90)
                newScene.add(rectAreaLight)

                const rectAreaLightHelper = new RectAreaLightHelper(rectAreaLight)
                newScene.add(rectAreaLightHelper)
                break
            case LightType.SpotLight:
                const spotLight = new Three.SpotLight(0xFFFFFF, 1)
                spotLight.position.set(0, 10, 0);
                spotLight.target.position.set(-5, 0, 0)
                newScene.add(spotLight)
                newScene.add(spotLight.target)

                const spotLightHelper = new Three.SpotLightHelper(spotLight)
                newScene.add(spotLightHelper)
                break
            default:
                console.log('???')
                break
        }
    }, [type])

    return (
        <div className='full-screen'>
            <div className='buttons'>
                {
                    buttonLabels.map((label, index) => {
                        return <button
                            className={label === type ? 'button-selected' : ''}
                            onClick={() => { setType(label) }}
                            key={`button${index}`}
                        >{label}</button>
                    })
                }
            </div>
            <canvas ref={canvasRef} />
        </div>

    )

}