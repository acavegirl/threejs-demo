import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Scene, PerspectiveCamera, WebGLRenderer, BoxGeometry, MeshBasicMaterial, Mesh, MeshPhongMaterial, DirectionalLight, Vector3, BufferGeometry, LineBasicMaterial, Line, CapsuleGeometry, CircleGeometry, ConeGeometry, CylinderGeometry, EdgesGeometry, LineSegments, WireframeGeometry, Box3, Box3Helper } from 'three';

// BoxGeometry(width : Float, height : Float, depth : Float, widthSegments : Integer, heightSegments : Integer, depthSegments : Integer)
const boxGeo = new BoxGeometry(1, 1, 1)
// CapsuleGeometry(radius : Float, length : Float, capSegments : Integer, radialSegments : Integer)
const capsuleGeo = new CapsuleGeometry(1, 1, 32, 32)
// CircleGeometry(radius : Float, segments : Integer, thetaStart : Float, thetaLength : Float)
const circleGeo = new CircleGeometry(1, 50)
// ConeGeometry(radius : Float, height : Float, radialSegments : Integer, heightSegments : Integer, openEnded : Boolean, thetaStart : Float, thetaLength : Float)
const coneGeo = new ConeGeometry(1, 2)
// CylinderGeometry(radiusTop : Float, radiusBottom : Float, height : Float, radialSegments : Integer, heightSegments : Integer, openEnded : Boolean, thetaStart : Float, thetaLength : Float)
const cylinderGeo = new CylinderGeometry(1, 1, 1)


const geometryArr = [boxGeo, capsuleGeo, circleGeo, coneGeo, cylinderGeo]

const createMaterial = () => {
  const material = new MeshPhongMaterial()

  const hue = Math.floor(Math.random() * 100) / 100 //随机获得一个色相
  const saturation = 1 //饱和度
  const luminance = 0.5 //亮度

  material.color.setHSL(hue, saturation, luminance)

  return material
}

const meshArr = geometryArr.map((geometry) => {
  const material = createMaterial()
  return new Mesh(geometry, material)
})

const edges = new EdgesGeometry( cylinderGeo );
const line = new LineSegments( edges, new LineBasicMaterial( { color: 0xffffff } ) );
meshArr.push(line)

const wireframe = new WireframeGeometry( cylinderGeo );
const line1 = new LineSegments( wireframe );
line1.material.depthTest = false;
line1.material.opacity = 0.25;
line1.material.transparent = true;
meshArr.push(line1)


const box = new Box3(); 
box.setFromCenterAndSize( new Vector3( 1, 1, 1 ), new Vector3( 2, 1, 3 ) );
const helper = new Box3Helper( box, 0xffff00 );
meshArr.push(helper);


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
    camera.position.z = 50
    

    //初始化渲染器
    const renderer = new WebGLRenderer({ canvas: canvasRef.current })
    

    //添加 2 盏灯光
    const light0 = new DirectionalLight(0xFFFFFF, 1)
    light0.position.set(-1, 2, 4)
    scene.add(light0)

    const light1 = new DirectionalLight(0xFFFFFF, 1)
    light1.position.set(1, -2, -4)
    scene.add(light1)



    //定义物体在画面中显示的网格布局
    const eachRow = 4 //每一行显示 5 个
    const spread = 15 //行高 和 列宽

    


    meshArr.forEach((mesh, index) => {
        //我们设定的排列是每行显示 eachRow，即 5 个物体、行高 和 列宽 均为 spread 即 15
        //因此每个物体根据顺序，计算出自己所在的位置
        const row = Math.floor(index / eachRow) //计算出所在行
        const column = index % eachRow //计算出所在列

        mesh.position.x = (column - 2) * spread //为什么要 -2 ？
        //因为我们希望将每一行物体摆放的单元格，依次是：-2、-1、0、1、2，这样可以使每一整行物体处于居中显示
        mesh.position.y = (2 - row) * spread

        scene.add(mesh) //将网格添加到场景中
    })

    

    sceneRef.current = scene
    cameraRef.current = camera
    rendererRef.current = renderer

    //添加自动旋转渲染动画
    const renderFn = (time: number) => {
        time = time * 0.001
        meshArr.forEach(item => {
            item.rotation.x = time
            item.rotation.y = time
        })

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