import axios from 'axios'
import { customCost } from '../features/other/other'
import { useDispatch, useSelector } from 'react-redux'
import { useState } from 'react'
import { removeBillList } from '../admin/featearAdmin/updateBillSlice'
import { removeBill } from '../features/purchase/purchaseSlice'
import { customTitle } from '../features/other/other'
import { Link } from 'react-router-dom'
import style from './stylePurchase.module.scss'
import  Detailpay  from './Detailpay'

let ApiDeletePayProduct = async (bill) => {
    let res = await axios.post('http://localhost:3800/delete/pay/product', {bill})
    let dataResponse = await res.data
    return dataResponse
}

let ApiReceiveProduct = async (id_bill) => {
    let res = await axios.post('http://localhost:3800/accept_bill', {id_bill})
    let dataResponse = await res.data
    return dataResponse
}

let ApiAcceptCate = async (id_bill, path_url) => {
    let res = await axios.post(`http://localhost:3800/admin/manager/${path_url}`, {id_bill})
    let dataResponse = await res.data
    return dataResponse
}

let Accept = (id_bill, dispatch , path_url)=> {
    ApiAcceptCate(id_bill , path_url).then(dataResponse => {
        dispatch(removeBillList(dataResponse.id_bill))
    })
}



let ReceiveProduct = (id_bill, dispatch) => {
    ApiReceiveProduct(id_bill).then(dataResponse => {
        dispatch(removeBill(dataResponse.id_bill))
    })
}

let DeletePay = (id_bill, id_product, size , quantity, dispatch ) => {
    const bill = {
        id_bill,
        id_product,
        size,
        quantity
    }
    ApiDeletePayProduct(bill).then(dataResponse => {
        dispatch(removeBill(dataResponse.id_bill))
    })
}



function Purchase({data, socket}){
    console.log(socket)
    const dispatch = useDispatch()
    const [ check , setCheck ] = useState(false)
    const { checkAdmin } = useSelector((state) => state.admin)
    return (
        <div className={style.purchase_sub} >

            <div className={style.infor_basic_bill}>

                <div className={style.infor_basic} >
                    <img width={100} height={120} src={data.product.pic} alt="pic_of_product" />
                    <div className={style.detail}>
                        <Link className={style.title} to={`/product/${customTitle(data.product.title)}/${data.product.id_product}`} >{data.product.title}</Link>
                        <div className={style.size} >K??ch th?????c : {data.size}</div>
                        <div className={style.quantity} >S??? l?????ng : {data.quantity}</div>
                    </div>
                </div>

                <div className={style.cost} >
                    <span style={{textDecorationLine : 'line-through', opacity : '0.6'}}>{customCost(data.product.cost ,0,1)}?? </span>
                    <span> {customCost(data.product.cost, data.product.discount, 1)}??</span>
                </div>

                <div className={style.status_bill}>
                    <span>Tr???ng th??i : </span> <span style={{color : '#26aa99'}} >{data.checkstatus.title}</span> 
                </div>
            </div>

            

            <div className={style.sum_cost} >T???ng s??? ti???n : {customCost(data.product.cost, data.product.discount, data.quantity)}??</div>

            <div className={style.btn_nav_function} >

                {checkAdmin=== false && data.checkstatus.status ? <button className={style.btn_nav} onClick={() => {
                    ReceiveProduct(data.id_bill,dispatch)
                }} >???? nh???n h??ng</button> : null}

                {checkAdmin === false && (data.checkstatus.title === process.env.REACT_APP_STATUS_WAIT || data.checkstatus.title === process.env.REACT_APP_STATUS_GETTING_PRODUCT) ? 
                <button className={style.btn_nav} onClick={() => {
                    DeletePay(data.id_bill, data.product.id_product, data.size, data.quantity, dispatch)
                }} >H???y h??a ????n</button> : null}

                {checkAdmin && data.checkstatus.title === process.env.REACT_APP_STATUS_WAIT ? 
                <button className={style.btn_nav} onClick={() => {
                    Accept(data.id_bill, dispatch, process.env.REACT_APP_URL_CATE_WAIT)
                    socket.current.emit('send', {check :true})
                }} > X??c nh???n </button> : null}

                {checkAdmin && data.checkstatus.title === process.env.REACT_APP_STATUS_GETTING_PRODUCT ? 
                <button className={style.btn_nav} onClick={() => {
                    Accept(data.id_bill, dispatch, process.env.REACT_APP_URL_CATE_GETTING)
                    socket.current.emit('send', {check :true})
                }}>X??c nh???n giao h??ng</button> : null}

                <button className={style.btn_nav} onClick={() => {
                    setCheck(true)
                }} >Xem chi ti???t ????n h??ng</button>

            </div>
            
            {check === true ?
            <div>
                <Detailpay detail={data} check={setCheck} />
            </div>: null }

        </div>
    )
}


export default Purchase