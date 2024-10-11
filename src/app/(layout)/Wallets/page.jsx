'use client';
import { useUser } from '@/context/Context'
import { getSpecificData, writeUserData } from '@/firebase/database'
import { useState, useEffect, useRef } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import Button from '@/components/Button'
import Loader from '@/components/Loader'
// import { getCurrencyExchange } from '@/currency';
import Modal from '@/components/Modal'
import { useRouter } from 'next/navigation';
import { useSearchParams } from 'next/navigation'



export default function Home() {

    const { user, userDB, setUserProfile, modal, countries, setModal, users, setUsers, setUserSuccess, success, setUserData, postsIMG, setUserPostsIMG, divisas, setDivisas, item, setItem, exchange, setExchange, destinatario, setDestinatario, transferencia } = useUser()
    const router = useRouter()
    const [filter, setFilter] = useState('')
    const [state, setState] = useState({})
    const [temporal, setTemporal] = useState(undefined)
    const refFirst = useRef(null);

    const searchParams = useSearchParams()
    const pathname = searchParams.get('operacion')

    function onChangeFilter(e) {
        setFilter(e.target.value)
    }
    // function sortArray(x, y) {
    //     if (x['translation']['spa']['common'].toLowerCase() < y['translation']['spa']['common'].toLowerCase()) { return -1 }
    //     if (x['translation']['spa']['common'].toLowerCase() > y['translation']['spa']['common'].toLowerCase()) { return 1 }
    //     return 0
    // }
    // function onChangeHandler(e, i) {
    //     setState({ ...state, [i.cca3]: { ...state[i.cca3], [e.target.name]: e.target.value } })
    // }
    function save(i) {
        setDestinatario({ ...i, ...state, operacion: pathname })
        pathname === 'Cambio'
         ?router.push('/ConfirmCambio/')
         :router.push('/Confirm/')
    }
    function redirect() {
        setDestinatario({ operacion: pathname })
        router.push(`/Register/Wallets?operacion=${pathname}`)
    }
    function manage(i, data) {
        setItem(i)
        setModal(data)
    }
    async function deletConfirm() {
        const callback = () => {
            getSpecificData(`/users/${user.uid}`, setUserData, () => { setModal('') })
        }
        await removeData(`users/${user.uuid}/destinatarios/${item.uuid}`, setUserSuccess, callback)
    }
    const prev = () => {
        requestAnimationFrame(() => {
            const scrollLeft = refFirst.current.scrollLeft;
            const itemWidth = screen.width - 50
            refFirst.current.scrollLeft = scrollLeft - itemWidth;
        });
    };
    const next = () => {
        requestAnimationFrame(() => {
            const scrollLeft = refFirst.current.scrollLeft;
            const itemWidth = screen.width - 50
            refFirst.current.scrollLeft = scrollLeft + itemWidth;
        });
    };

    useEffect(() => {
        transferencia === '' && router.replace('/')
    })

    return (
        <main className='w-full h-full'>
            {modal === 'Guardando...' && <Loader> {modal} </Loader>}
            {modal === 'Save' && <Modal funcion={saveConfirm}>Estas por modificar la tasa de cambio de:  {item['currency']}</Modal>}
            {modal === 'Disable' && <Modal funcion={disableConfirm}>Estas por {item.habilitado !== undefined && item.habilitado !== false ? 'DESABILITAR' : 'HABILITAR'} el siguiente item:  {item['currency']}</Modal>}
            {modal === 'DELETE' && <Modal theme="Danger" button="Eliminar" funcion={deletConfirm}>Estas por eliminar al siguiente destinatario:  {item['destinatario']}</Modal>}
            <button className='fixed text-[20px] text-gray-500 h-[50px] w-[50px] rounded-full inline-block left-[0px] top-0 bottom-0 my-auto bg-[#00000010] z-20 lg:left-[20px]' onClick={prev}>{'<'}</button>
            <button className='fixed text-[20px] text-gray-500 h-[50px] w-[50px] rounded-full inline-block right-[0px] top-0 bottom-0 my-auto bg-[#00000010] z-20 lg:right-[20px]' onClick={next}>{'>'}</button>
            <div className="w-full   relative h-full overflow-auto shadow-2xl p-5 bg-white min-h-[80vh] scroll-smooth" ref={refFirst}>
                <h3 className='font-medium text-[14px]'>Destinatarios</h3>
                <br />
                <div className="w-[405px] grid grid-cols-2 gap-[5px]" >
                    {/* <input type="text" className='border-b-[1px] text-[14px] text-black outline-none w-[200px]' onChange={onChangeFilter} placeholder='Buscar Destinatario' /> */}
                    <button className='w-[200px] flex justify-center items-center h-[40px] text-white text-[14px] font-medium bg-[#32CD32] border border-gray-200 rounded-[10px] px-5 cursor-pointer' onClick={redirect}>Nuevo destinatario</button>
                </div>
                <br />
                <table className={`w-full ${pathname === 'Envio' ? 'min-w-[1500px]' : 'min-w-[1000px]'} border-[1px] bg-white text-[14px] text-left text-gray-500 `}>
                    {pathname === 'Cambio' && <thead className="text-[14px] text-white uppercase bg-gray-800">
                        <tr>
                            <th scope="col" className="w-[50px] px-3 py-3">
                                #
                            </th>
                            <th scope="col" className=" px-3 py-3">
                                Nombre
                            </th>
                            <th scope="col" className="px-3 py-3">
                                DNI
                            </th>
                            <th scope="col" className="px-3 py-3">
                                Celular
                            </th>
                            <th scope="col" className=" px-3 py-3">
                                Dirección de billetera
                            </th>
                            <th scope="col" className="px-3 py-3">
                                Red
                            </th>
                            <th scope="col" className=" px-3 py-3">
                                QR
                            </th>

                            <th scope="col" className="text-center px-3 py-3">
                                Enviar
                            </th>
                            {/* <th scope="col" className="text-center px-3 py-3">
                                Eliminar
                            </th> */}
                        </tr>
                    </thead>}
                    {pathname === 'Envio' && <thead className="text-[14px] text-white uppercase bg-gray-800">
                        <tr>
                            <th scope="col" className="w-[50px] px-3 py-3">
                                #
                            </th>
                            <th scope="col" className=" px-3 py-3">
                                Nombre
                            </th>
                            <th scope="col" className="px-3 py-3">
                                DNI
                            </th>
                            <th scope="col" className=" px-3 py-3">
                                Pais
                            </th>
                            <th scope="col" className=" px-3 py-3">
                                Dirección
                            </th>
                            <th scope="col" className="px-3 py-3">
                                Celular
                            </th>
                            <th scope="col" className=" px-3 py-3">
                                Direccion de billetera
                            </th>
                            <th scope="col" className="px-3 py-3">
                                Red
                            </th>
                            <th scope="col" className="px-3 py-3">
                                QR
                            </th>
                            <th scope="col" className="text-center px-3 py-3">
                                Enviar
                            </th>
                            {/* <th scope="col" className="text-center px-3 py-3">
                                Eliminar
                            </th> */}
                        </tr>
                    </thead>}
                    <tbody>
                        {pathname === 'Envio' && userDB && userDB !== undefined && userDB.destinatarioWallets && userDB.destinatarioWallets !== undefined && Object.values(userDB.destinatarioWallets).map((i, index) => {
                            return <tr className={`text-[14px] border-b hover:bg-gray-100  ${index % 2 === 0 ? 'bg-gray-100' : 'bg-gray-100'} `} key={index}>
                                <td className="px-3 py-4  flex text-gray-900 ">
                                    <span className='h-full flex py-2'>{index + 1}</span>
                                </td>
                                <td className="px-3 py-4 text-gray-900 ">
                                    {i['destinatario']}
                                </td>
                                <td className="w-32 p-3">
                                    {i['dni']}
                                    {/* <input type="text" name="dni" className='min-w-[100px] text-center p-2 outline-blue-200 rounded-xl' onChange={(e) => onChangeHandler(e, i)} defaultValue={i['dni'] !== undefined ? i['dni'] : 0} /> */}
                                </td>
                                <td className="w-32 p-3">
                                    {i['pais']}{countries?.[i?.cca3]?.envio !== undefined && countries[i.cca3].envio === true ? <span className='text-green-400 text-[10px] py-2 px-3 rounded-[5px] bg-gray-800 inline-block'> habilitado: USDT</span> :<span className='text-red-400 text-[10px]  py-2 px-3 rounded-[5px] bg-gray-800 inline-block'> inhabilitado</span>}

                                    {/* <input type="text" name="pais" className='min-w-[100px] text-left p-2 outline-blue-200 rounded-xl' onChange={(e) => onChangeHandler(e, i)} defaultValue={i['pais'] !== undefined ? i['pais'] : 0} /> */}
                                </td>
                                <td className="w-32 p-3">
                                    {i['direccion']}
                                    {/* <input type="text" name="direccion" className='min-w-[100px] text-left p-2 outline-blue-200 rounded-xl' onChange={(e) => onChangeHandler(e, i)} defaultValue={i['direccion'] !== undefined ? i['direccion'] : 0} /> */}
                                </td>
                                <td className="w-32 p-3">
                                    {i['celular']}
                                    {/* <input type="text" name="celular" className='min-w-[100px] text-center p-2 outline-blue-200 rounded-xl' onChange={(e) => onChangeHandler(e, i)} defaultValue={i['celular'] !== undefined ? i['celular'] : 0} /> */}
                                </td>
                                <td className=" p-3">
                                    {i['billetera destinatario']}
                                    {/* <input type="text" name="cuenta destinatario" className='min-w-[100px] text-center p-2 outline-blue-200 rounded-xl' onChange={(e) => onChangeHandler(e, i)} defaultValue={i['cuenta destinatario'] !== undefined ? i['cuenta destinatario'] : 0} /> */}
                                </td>
                                <td className="w-32 p-3">
                                    {i['red destinatario']}
                                    {/* <input type="text" name="nombre de banco" className='min-w-[100px] text-center p-2 outline-blue-200 rounded-xl' onChange={(e) => onChangeHandler(e, i)} defaultValue={i['nombre de banco'] !== undefined ? i['nombre de banco'] : 0} /> */}
                                </td>
                                <td className="w-[150px] p-4">
                                    <img src={i.url} className={`h-[100px] w-[100px]`} onClick={() => handlerProfileIMG(i.image3)} alt="Apple Watch" />
                                </td>
                                <td className="px-3 py-4 w-32 text-center">
                                    {/* <Button theme={"Success"} click={() => save(i)}>Continuar</Button> */}
                                    {countries?.[i?.cca3]?.envio !== undefined && countries[i.cca3].envio === true ? <Button theme={"Success"} click={() => save(i)}>Continuar</Button>:<Button theme={"Disable"}>inhabilitado</Button>}

                                </td>
                                {/* <td className="px-3 py-4 ">
                                    <Button theme={"Danger"} click={() => manage(i, 'DELETE')}>Eliminar</Button>
                                </td> */}
                            </tr>
                        })
                        }
                        {pathname === 'Cambio' && userDB && userDB !== undefined && userDB.wallets && userDB.wallets !== undefined && Object.values(userDB.wallets).map((i, index) => {
                            return <tr className={`text-[14px] border-b hover:bg-gray-100  ${index % 2 === 0 ? 'bg-gray-100' : 'bg-gray-100'} `} key={index}>
                                <td className="px-3 py-4  flex text-gray-900 ">
                                    <span className='h-full flex py-2'>{index + 1}</span>
                                </td>
                                <td className="px-3 py-4 text-gray-900 ">
                                    {userDB.nombre}  {userDB.apellido}
                                </td>
                                <td className=" p-3">
                                    {userDB.dni}
                                    {/* <input type="text" name="dni" className='min-w-[100px] text-center p-2 outline-blue-200 rounded-xl' onChange={(e) => onChangeHandler(e, i)} defaultValue={i['dni'] !== undefined ? i['dni'] : 0} /> */}
                                </td>

                                <td className=" p-3">
                                    {userDB.whatsapp}
                                    {/* <input type="text" name="celular" className='min-w-[100px] text-center p-2 outline-blue-200 rounded-xl' onChange={(e) => onChangeHandler(e, i)} defaultValue={i['celular'] !== undefined ? i['celular'] : 0} /> */}
                                </td>
                                <td className="w-32 p-3">
                                    {i['billetera destinatario']}
                                    {/* <input type="text" name="cuenta destinatario" className='min-w-[100px] text-center p-2 outline-blue-200 rounded-xl' onChange={(e) => onChangeHandler(e, i)} defaultValue={i['cuenta destinatario'] !== undefined ? i['cuenta destinatario'] : 0} /> */}
                                </td>
                                <td className="w-32 p-3">
                                    {i['red destinatario']}
                                    {/* <input type="text" name="nombre de banco" className='min-w-[100px] text-center p-2 outline-blue-200 rounded-xl' onChange={(e) => onChangeHandler(e, i)} defaultValue={i['nombre de banco'] !== undefined ? i['nombre de banco'] : 0} /> */}
                                </td>
                                <td className="w-32 p-4">
                                    <img src={i.url} className={`h-[100px] w-[100px]`} onClick={() => handlerProfileIMG(i.image3)} alt="Apple Watch" />
                                </td>
                                <td className="px-3 py-4 w-32 text-center">
                                    <Button theme={"Success"} click={() => save(i)}>Continuar</Button>
                                </td>
                                {/* <td className="px-3 py-4 ">
                                    <Button theme={"Danger"} click={() => manage(i, 'DELETE')}>Eliminar</Button>
                                </td> */}
                            </tr>
                        })
                        }
                    </tbody>
                </table>
            </div>
        </main>
    )
}




