import React, { useEffect } from 'react'
import { makeStyles } from '@material-ui/core/styles'
import MenuItem from '@material-ui/core/MenuItem'
import FormControl from '@material-ui/core/FormControl'
import Select from '@material-ui/core/Select'
import {
    bscNetworkDetail,
    ethereumNetworkDetail,
    harmonyNetworkDetail,
    polygonNetworkDetail,
} from '../../utils/networkConstants'
import { setupNetwork } from '../../utils/helper'
import config from '../../utils/config'
import { currentConnection } from '../../constants'

import etherIcon from "../../assets/ether.png";
import binanceIcon from "../../assets/binance.png";
import harmonyIcon from "../../assets/one.png";
import polygonIcon from "../../assets/polygon.png";

const useStyles = makeStyles((theme) => ({
    root: {
        display: 'flex',
        justifyContent: 'space-around',
        // "& .MuiOutlinedInput-root .MuiOutlinedInput-notchedOutline": {
        //     borderColor: "green"
        // },

        "& .MuiOutlinedInput-input": {
            color: "white"
        },
        "& .MuiInputLabel-root": {
            color: "green"
        },
        // "& .MuiOutlinedInput-root .MuiOutlinedInput-notchedOutline": {
        //     borderColor: "white"
        // },
        // "&:hover .MuiOutlinedInput-input": {
        //     color: "red"
        // },
        // "&:hover .MuiInputLabel-root": {
        //     color: "red"
        // },
        // "&:hover .MuiOutlinedInput-root .MuiOutlinedInput-notchedOutline": {
        //     borderColor: "red"
        // },
        // "& .MuiOutlinedInput-root.Mui-focused .MuiOutlinedInput-input": {
        //     color: "purple"
        // },
        "& .MuiInputLabel-root.Mui-focused": {
            color: "white"
        },
        // "& .MuiOutlinedInput-root.Mui-focused .MuiOutlinedInput-notchedOutline": {
        //     borderColor: "purple"
        // }

    },
    imgIcon: {
        marginLeft: 10,
        height: 23,
    },
    buttonDrop: {
        display: 'flex',
        justifyContent: 'space-between',
        color: 'black',
        backgroundColor: 'white',
        '&:hover': {
            backgroundColor: 'grey',
            color: '#100525'
        },
    },
    main: {
        color: 'white',
        backgroundColor: '#100525',
        border: '1px solid white',
        borderRadius: 60,
        paddingLeft: 10,
        '&$focused $notchedOutline': {
            borderColor: 'inherit !important'
        }
    },
}))
export default function NetworkSelect({ selectedNetwork }) {
    const classes = useStyles()
    const [network, setNetwork] = React.useState(
        parseInt(localStorage.getItem('currentNetwork') || config.chainId),
    )
    useEffect(() => {
        console.log('selected chain id', selectedNetwork)
        if (!localStorage.getItem('currentNetwork')) {
            // setupNetwork(ethereumNetworkDetail.mainnet)
            localStorage.currentNetwork = selectedNetwork
        }
        handleChange(selectedNetwork)
    }, [selectedNetwork])

    const handleChange = (_selected) => {
        // console.log('selected network', selectedNetwork)
        if (network === _selected) {
            return
        }
        localStorage.setItem('currentNetwork', _selected)
        setNetwork(_selected)
        if ([config.bscChain, config.bscChainTestent].includes(_selected)) {
            setupNetwork(
                currentConnection === 'mainnet'
                    ? bscNetworkDetail.mainnet
                    : bscNetworkDetail.testnet,
            )
        } else if ([config.polygon_chain_mainnet, config.polygon_chain_testnet].includes(_selected)) {
            setupNetwork(
                currentConnection === 'mainnet'
                    ? polygonNetworkDetail.mainnet
                    : polygonNetworkDetail.testnet,
            )
        } else if ([config.hmyChainMainnet, config.hmyChainTestnet].includes(_selected)) {
            setupNetwork(
                currentConnection === 'mainnet'
                    ? harmonyNetworkDetail.mainnet
                    : harmonyNetworkDetail.testnet,
            )
        } else {
            setupNetwork(
                currentConnection === 'mainnet'
                    ? ethereumNetworkDetail.mainnet
                    : ethereumNetworkDetail.testnet,
            )
        }
    }
    return (
        <div>
            <FormControl className={classes.root} variant='outlined'  >
                <Select
                    className={classes.main}
                    value={network}
                    onChange={({ target: { value } }) => handleChange(value)}
                >
                    <MenuItem
                        value={currentConnection === 'testnet' ? config.chainIdTestnet : config.chainId}
                        className={classes.buttonDrop}
                    >
                        <span>Ethereum</span>
                        <img className={classes.imgIcon} src={etherIcon} />
                    </MenuItem>
                    <MenuItem value={currentConnection === 'testnet' ? config.bscChainTestent : config.bscChain} className={classes.buttonDrop}>
                        <span>Binance Smart Chain</span>
                        <img className={classes.imgIcon} src={binanceIcon} />
                    </MenuItem>
                    <MenuItem value={currentConnection === 'testnet' ? config.polygon_chain_testnet : config.polygon_chain_mainnet} className={classes.buttonDrop}>
                        <span>Polygon</span>
                        <img className={classes.imgIcon} src={polygonIcon} />
                    </MenuItem>
                    <MenuItem value={currentConnection === 'testnet' ? config.hmyChainTestnet : config.hmyChainMainnet} className={classes.buttonDrop}>
                        <span>Harmony</span>
                        <img className={classes.imgIcon} src={harmonyIcon} />
                    </MenuItem>
                </Select>
            </FormControl>
        </div>
    )
}