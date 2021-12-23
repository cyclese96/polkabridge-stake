import { Button, Card, Divider, makeStyles } from "@material-ui/core";
import { useEffect } from "react";

import biteImg from "../assets/bite.png";
import corgiImg from "../assets/corgi.png";
import pwarImg from "../assets/pwar.png";
import clf365Img from "../assets/clf365.png";
import punImg from "../assets/punt.png";
import CustomButton from "./CustomButton";
import {
  formatCurrency,
  formatLargeNumber,
  fromWei,
  toWei,
} from "../utils/helper";
import { connect } from "react-redux";
import {
  confirmAllowance,
  getUserStakedData,
  getPoolInfo,
  unstakeTokens,
} from "../actions/stakeActions";
import { getAccountBalance } from "../actions/accountActions";
import {
  claimTokens,
  CFL365,
  etheriumNetwork,
  PWAR,
  supportedStaking,
  PUN,
  SHOE,
  bscNetwork,
  harmonyNetwork,
  maticNetwork,
  tokenContarctAddresses,
  WELT,
  GRAV,
  DEFLY,
} from "../constants";
import Loader from "./../common/Loader";
import DotCircle from "./../common/DotCircle";

const useStyles = makeStyles((theme) => ({
  card: {
    width: "100%",
    minHeight: 421,
    borderRadius: 30,
    backgroundColor: "rgba(41, 42, 66, 0.3)",
    border: "1px solid #212121",
    filter: "drop-shadow(0 0 0.5rem #212121)",
    border: "1px solid #212121",
    [theme.breakpoints.down("sm")]: {
      paddingLeft: 0,
      paddingRight: 0,
      width: "100%",
      height: "100%",
    },
  },
  cardHeader: {
    paddingTop: 10,
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    width: "100%",
  },
  cardContents: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "space-around",
    height: "100%",
    width: "100%",
  },
  avatar: {
    height: "35px",
  },
  cardHeading: {
    fontSize: 18,
  },
  cardText: {
    fontSize: 14,
    alignSelf: "start",
    marginLeft: 60,
    margin: 0,
  },

  buttons: {
    marginTop: 20,
    marginBottom: 20,
  },
  numbers: {
    color: "#E0077D",
    fontSize: 26,
  },
  hint: {
    paddingTop: 4,
    fontSize: 10,
    fontWeight: 400,
    color: "#919191",
    [theme.breakpoints.down("sm")]: {
      fontSize: 10,
    },
  },
  bitePool: {
    marginBottom: 20,
    alignSelf: "start",
  },
  poolItemText: {
    fontSize: 12,
    marginLeft: 60,
    margin: 0,
    marginTop: 2,
  },
  stakeButtons: {
    display: "flex",
    justifyContent: "center",
    flexWrap: "wrap-reverse",
  },
  stakeButton: {
    marginTop: 5,
    alignSelf: "center",
    justifySelf: "center",
  },
  logoWrapper: {
    height: 45,
    width: 45,
    backgroundColor: "white",
    borderRadius: "50%",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
  },

  tokenTitle: {
    fontWeight: 500,
    padding: 0,
    paddingLeft: 10,
    fontSize: 14,
    paddingBottom: 3,
    color: "#e5e5e5",
  },
  tokenTitleTvl: {
    paddingLeft: 10,
    paddingRight: 10,
    paddingTop: 5,
    paddingBottom: 5,
    marginLeft: 10,
    fontSize: 14,
    fontWeight: 600,
    color: "#e5e5e5",
    // backgroundColor: "#C80C81",
    border: "1px solid rgba(224, 7, 125, 0.6)",

    borderRadius: 14,
  },
  tokenSubtitle: {
    fontWeight: 300,
    padding: 0,
    paddingLeft: 10,
    fontSize: 12,
    color: "#bdbdbd",
  },
  tokenAmount: {
    fontWeight: 700,
    padding: 0,
    paddingLeft: 10,
    fontSize: 18,
    color: "#C80C81",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
  },
  tokenAmountTvl: {
    fontWeight: 700,
    padding: 0,
    paddingLeft: 10,
    fontSize: 18,
    color: "#e5e5e5",
  },
  logo: {
    width: 80,
    height: 80,
    marginTop: 5,
    marginBottom: 10,
    backgroundColor: "#f9f9f9",
    padding: 12,
    [theme.breakpoints.down("sm")]: {
      width: 50,
      height: 50,
      marginBottom: 10,
    },
  },
  earn: {
    textAlign: "center",
    color: "#bdbdbd",
    fontSize: 10,
  },
  desktop: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-between",
    paddingLeft: 10,
    paddingRight: 10,
    [theme.breakpoints.down("sm")]: {
      flexDirection: "row",
    },
  },
  borderButton: {
    background: `transparent`,
    color: "white",
    width: "fit-content",
    height: 32,
    textTransform: "none",
    borderRadius: 30,
    fontSize: 15,
    marginRight: 5,
    marginLeft: 5,
    border: "1px solid rgba(224, 7, 125, 0.3)",
    padding: "5px 20px 5px 20px",
    "&:hover": {
      background: "rgba(224, 7, 125, 0.7)",
    },
    [theme.breakpoints.down("sm")]: {
      width: "fit-content",
      fontSize: 13,
    },
  },
}));

const Staking = ({
  stake: { stake, pool, approved },
  account: { currentAccount, currentNetwork, loading, error },
  tokenType,
  getUserStakedData,
  confirmAllowance,
  getPoolInfo,
  getAccountBalance,
  unstakeTokens,
  onStake,
  onUnstake,
  price,
}) => {
  const classes = useStyles();

  useEffect(async () => {
    getUserStakedData(tokenType, currentNetwork);
  }, [currentAccount, currentNetwork]);

  const handleApprove = async (tokenType) => {
    const tokenWeiAmountToApprove =
      currentNetwork === bscNetwork
        ? "999999999999999999999999999999999999"
        : toWei("999999999");

    await confirmAllowance(
      tokenWeiAmountToApprove,
      tokenType,
      currentNetwork,
      currentAccount
    );
    // alert(
    //   `tokenType: ${tokenType}  currentNetwork: ${currentNetwork} tokenAmount:  ${tokenWeiAmountToApprove}`
    // );
    await getUserStakedData(tokenType, currentNetwork);
  };

  const handleClaim = async (tokenType) => {
    const tokensToClaim = claimTokens;

    await unstakeTokens(
      tokensToClaim,
      currentAccount,
      tokenType,
      currentNetwork
    );
    await Promise.all([
      getPoolInfo(currentNetwork),
      getAccountBalance(currentNetwork),
    ]);
  };

  const currentAmount = (tokenType) => {
    return stake[tokenType] ? stake[tokenType].amount : 0;
  };

  const tokenLogo = {
    PBR: "img/symbol.png",
    BITE: biteImg,
    CORGIB: corgiImg,
    PWAR: pwarImg,
    CFL365: clf365Img,
    PUN: punImg,
    SHOE: "img/shoefy.png",
    WELT: "img/welt.png",
    GRAV: "img/grv.png",
    DEFLY: "img/defly.png",
  };

  const tokenName = {
    PBR: "PolkaBridge",
    BITE: "DragonBite",
    CORGIB: "Corgi Of PolkaBridge",
    PWAR: "PolkaWar",
    CFL365: "CFL 365",
    PUN: "CryptoPunt",
    SHOE: "Shoefy",
    WELT: "FabWelt",
    GRAV: "Graviton Zero",
    DEFLY: "DeflyBall",
  };

  const tokenInfo = {
    PBR: {
      ethereum: {
        buy: "https://app.uniswap.org/#/swap?inputCurrency=ETH&outputCurrency=0x298d492e8c1d909d3f63bc4a36c66c64acb3d695",
        info: "https://www.coingecko.com/en/coins/polkabridge",
      },
      matic: {
        buy: "https://quickswap.exchange/#/swap?inputCurrency=MATIC&outputCurrency=0x0D6ae2a429df13e44A07Cd2969E085e4833f64A0",
        info: "https://www.coingecko.com/en/coins/polkabridge",
      },
    },
    BITE: {
      ethereum: {
        buy: "https://app.uniswap.org/#/swap?inputCurrency=ETH&outputCurrency=0x4eed0fa8de12d5a86517f214c2f11586ba2ed88d",
        info: "https://www.coingecko.com/en/coins/dragonbite",
      },
    },
    CORGIB: {
      bsc: {
        buy: "https://pancakeswap.finance/swap#/swap?outputCurrency=0x1cfd6813a59d7b90c41dd5990ed99c3bf2eb8f55&inputCurrency=BNB",
        info: "https://www.coingecko.com/en/coins/the-corgi-of-polkabridge",
      },
    },
    PWAR: {
      bsc: {
        buy: "https://pancakeswap.finance/swap#/swap?outputCurrency=0x16153214e683018d5aa318864c8e692b66e16778&inputCurrency=BNB",
        info: "https://www.coingecko.com/en/coins/polkawar",
      },
    },
    GRAV: {
      bsc: {
        buy: `https://pancakeswap.finance/swap#/swap?outputCurrency=${tokenContarctAddresses.GRAV.bsc.mainnet}&inputCurrency=BNB`,
        info: "https://www.coingecko.com/en/coins/graviton-zero",
      },
    },
    DEFLY: {
      bsc: {
        buy: `https://pancakeswap.finance/swap#/swap?outputCurrency=${tokenContarctAddresses.DEFLY.bsc.mainnet}&inputCurrency=BNB`,
        info: "https://www.coingecko.com/en/coins/defly",
      },
    },
    CFL365: {
      ethereum: {
        buy: "https://app.uniswap.org/#/swap?inputCurrency=ETH&outputCurrency=0xcd6adc6b8bd396e2d53ccd7d7257b4de55be4fbe",
        info: "https://www.coingecko.com/en/coins/cfl365-finance",
      },
    },
    PUN: {
      ethereum: {
        buy: "https://app.uniswap.org/#/swap?inputCurrency=ETH&outputCurrency=0x31903e333809897ee57af57567f4377a1a78756c",
        info: "https://www.dextools.io/app/ether/pair-explorer/0xed1ba5252f94e029f41506adeaf90c459c0aca69",
      },
    },
    SHOE: {
      ethereum: {
        buy: "https://app.uniswap.org/#/swap?inputCurrency=ETH&outputCurrency=0x0fd67b4ceb9b607ef206904ec73459c4880132c9",
        info: "https://coinmarketcap.com/currencies/shoefy/ico/",
      },
    },
    WELT: {
      matic: {
        buy: `https://quickswap.exchange/#/swap?inputCurrency=MATIC&outputCurrency=${tokenContarctAddresses.WELT.polygon.mainnet}`,
        info: "https://www.dextools.io/app/polygon/pair-explorer/0x55e49f32fbba12aa360eec55200dafd1ac47aaed",
      },
    },
  };
  const getCurrentApy = () => {
    if (tokenType === "PBR") {
      return pool[tokenType]
        ? formatCurrency(pool[tokenType].pbrApy, false, 1, true) + " %"
        : "--";
    } else if (tokenType === "CORGIB") {
      return pool[tokenType]
        ? formatCurrency(pool[tokenType].corgibApy, false, 1, true) + " %"
        : "--";
    } else if (tokenType === "BITE") {
      return pool[tokenType]
        ? formatCurrency(pool[tokenType].biteApy, false, 1, true) + " %"
        : "--";
    } else if (tokenType === PWAR) {
      return pool[tokenType]
        ? formatCurrency(pool[tokenType].pwarApy, false, 1, true) + " %"
        : "--";
    } else if (tokenType === CFL365) {
      return pool[tokenType]
        ? formatCurrency(pool[tokenType].clf365Apy, false, 1, true) + " %"
        : "--";
    } else if (tokenType === SHOE) {
      return pool[tokenType]
        ? formatCurrency(pool[tokenType].shoeApy, false, 1, true) + " %"
        : "--";
    } else if (tokenType === PUN) {
      return pool[tokenType]
        ? formatCurrency(pool[tokenType].punApy, false, 1, true) + " %"
        : "--";
    } else if (tokenType === WELT) {
      return pool[tokenType]
        ? formatCurrency(pool[tokenType].weltApy, false, 1, true) + " %"
        : "--";
    } else if (tokenType === GRAV) {
      return pool[tokenType]
        ? formatCurrency(pool[tokenType].gravApy, false, 1, true) + " %"
        : "--";
    }
    else if (tokenType === DEFLY) {
      return pool?.[tokenType]
        ? formatCurrency(pool[tokenType].deflyApy, false, 1, true) + " %"
        : "--";
    } else {
      return "--";
    }
  };

  const getCurrencyFormatForToken = (tokenType, tokens) => {
    // if (tokenType === BITE) {
    //   return formatCurrency(fromWei(tokens));
    // } else if (tokenType === CFL365) {
    //   return formatCurrency(fromWei(tokens));
    // } else {
    //   return formatCurrency(fromWei(tokens), false, 1, true);
    // }
    return formatLargeNumber(fromWei(tokens));
  };

  const claimDisableStatus = (_tokenType) => {
    // if (_tokenType === PUN) {
    //   return true;
    // }
    return currentAmount(_tokenType) == 0;
  };

  const stakeDisableStatus = (_tokenType) => {
    if (_tokenType === PUN) {
      return true
    }
    return false;
  };

  const withdrawDisableStatus = (_tokenType) => {
    // if (_tokenType === PUN) {
    //   return true
    // }
    return false;
  };

  const approveDisableStatus = (_tokenType) => {
    // if (_tokenType === PUN) {
    //   return true
    // }
    return false;
  };

  const currentSupportedStaking = (_network) => {
    if (_network === etheriumNetwork) {
      return supportedStaking.ethereum;
    } else if (_network === bscNetwork) {
      return supportedStaking.bsc;
    } else if (_network === harmonyNetwork) {
      return supportedStaking.harmony;
    } else if (_network === maticNetwork) {
      return supportedStaking.matic;
    }
  };

  return (
    <Card elevation={10} className={classes.card}>
      {loading[tokenType] && (
        <div className="text-center">
          <Loader height={300} />
        </div>
      )}
      {!loading[tokenType] && (
        <div style={{ width: "100%" }}>
          <div className="d-flex justify-content-center align-items-center pt-2 pb-1">
            <img className={classes.avatar} src={tokenLogo[tokenType]} />
            <small
              style={{
                color: "#f9f9f9",
                marginLeft: 10,
                fontSize: 18,
              }}
            >
              {tokenType}
            </small>
          </div>

          <div className="d-flex justify-content-center align-items-center ">
            <div
              style={{
                backgroundColor: "#C80C81",
                borderRadius: "50%",
                height: "5px",
                width: "5px",
                marginRight: 5,
              }}
            ></div>
            <div className={classes.earn}>Earn {tokenName[tokenType]}</div>
          </div>
          <div className="d-flex justify-content-center  pt-3">
            <a href={tokenInfo?.[tokenType]?.[currentNetwork]?.buy} target="_blank">
              <Button variant="contained" className={classes.borderButton}>
                Buy
              </Button>
            </a>
            <a
              href={tokenInfo?.[tokenType]?.[currentNetwork]?.info}
              target="_blank"
            >
              <Button variant="contained" className={classes.borderButton}>
                Info
              </Button>
            </a>
          </div>
          <div style={{ minHeight: 120, paddingLeft: 10, paddingRight: 10 }}>
            {currentSupportedStaking(currentNetwork).includes(tokenType) ? (
              <div className="mt-3">
                <div className="d-flex justify-content-between mt-1">
                  <div className="d-flex justify-content-start">
                    <div>
                      <div className={classes.tokenTitle}>APY</div>
                    </div>
                  </div>
                  <div className={classes.tokenAmount}>{getCurrentApy()}</div>
                </div>
                <div className="d-flex justify-content-between mt-2">
                  <div className="d-flex justify-content-start">
                    <div>
                      <div className={classes.tokenTitle}>Total Staked</div>
                    </div>
                  </div>
                  <div className={classes.tokenAmount}>
                    {getCurrencyFormatForToken(
                      tokenType,
                      pool[tokenType] ? pool[tokenType].totalTokenStaked : "0"
                    )}
                  </div>
                </div>
                <div className="d-flex justify-content-between mt-2">
                  <div className="d-flex justify-content-start">
                    <div>
                      <div className={classes.tokenTitle}>Total Claimed</div>
                    </div>
                  </div>
                  <div className={classes.tokenAmount}>
                    {formatLargeNumber(
                      fromWei(
                        pool[tokenType]
                          ? pool[tokenType].totalTokenClaimed
                          : "0"
                      )
                    )}
                  </div>
                </div>
                <div className="d-flex justify-content-center my-4">
                  <div>
                    <div className={classes.tokenTitleTvl}>
                      Total Value Locked:{" "}
                      <span className={classes.tokenAmountTvl}>
                        $
                        {pool[tokenType]
                          ? formatLargeNumber(
                            fromWei(pool[tokenType].totalTokenStaked) *
                            (tokenType === "CORGIB"
                              ? parseFloat(pool[tokenType].tokenPriceCorgib)
                              : parseFloat(pool[tokenType].tokenPrice))
                          )
                          : "0"}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              ""
            )}
          </div>

          <Divider style={{ backgroundColor: "#616161", height: 1 }} />
          <div className={classes.desktop}>
            <div className="text-center mt-4">
              <div className={classes.tokenTitle}>Staked</div>
              <div className={classes.tokenAmount}>
                {" "}
                {tokenType === "PWAR"
                  ? formatCurrency(
                    fromWei(stake[tokenType]?.amount),
                    false,
                    1,
                    true
                  )
                  : formatCurrency(fromWei(stake[tokenType]?.amount))}{" "}
              </div>
            </div>
            <div className="text-center mt-4">
              <div className={classes.tokenTitle}>Claimed</div>
              <div className={classes.tokenAmount}>
                {" "}
                {tokenType === "PWAR"
                  ? formatCurrency(
                    fromWei(stake[tokenType]?.rewardClaimed),
                    false,
                    1,
                    true
                  )
                  : formatCurrency(
                    fromWei(stake[tokenType]?.rewardClaimed)
                  )}{" "}
              </div>
            </div>
            <div className="text-center mt-4">
              <div className={classes.tokenTitle}>Pending</div>
              <div className={classes.tokenAmount}>
                {" "}
                {tokenType === "PWAR"
                  ? formatCurrency(
                    fromWei(stake[tokenType]?.pendingReward),
                    false,
                    1,
                    true
                  )
                  : formatCurrency(
                    fromWei(stake[tokenType]?.pendingReward)
                  )}{" "}
              </div>
            </div>
          </div>

          <div className={classes.buttons}>
            {!approved[tokenType] ? (
              <div className="text-center">
                <CustomButton
                  disabled={approveDisableStatus(tokenType)}
                  onClick={() => handleApprove(tokenType)}
                >
                  Approve
                </CustomButton>
                <p className={classes.hint}>
                  <DotCircle />
                  <span style={{ paddingLeft: 5 }}>
                    Approve {tokenType} tokens to start staking
                  </span>
                </p>
              </div>
            ) : (
              <div className={classes.stakeButtons}>
                <CustomButton
                  disabled={claimDisableStatus(tokenType)}
                  onClick={() => handleClaim(tokenType)}
                >
                  Claim
                </CustomButton>

                <CustomButton
                  disabled={stakeDisableStatus(tokenType)}
                  onClick={() => onStake(tokenType)}
                >
                  Stake
                </CustomButton>
                <CustomButton
                  disabled={withdrawDisableStatus(tokenType)}
                  onClick={() => onUnstake(tokenType)}
                  variant="light"
                >
                  Unstake
                </CustomButton>
              </div>
            )}
          </div>
        </div>
      )}
    </Card>
  );
};

const mapStateToProps = (state) => ({
  stake: state.stake,
  account: state.account,
});

export default connect(mapStateToProps, {
  getUserStakedData,
  confirmAllowance,
  getPoolInfo,
  getAccountBalance,
  unstakeTokens,
})(Staking);
