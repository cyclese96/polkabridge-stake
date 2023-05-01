import { useEffect, useState } from "react";
import { fetchTokenPrice } from "../utils/helper";
import { Token } from "../utils/interface";
import { useDispatch } from "react-redux";
import { SET_TOKEN_PRICE } from "actions/types";

export function useTokenPrice(poolToken?: Token): boolean {
  const [loading, setLoading] = useState(false);
  const dispatch = useDispatch();

  async function fetchData(_token?: Token) {
    try {
      setLoading(true);
      // console.log("price test fetching price ", _token);
      let res = await fetchTokenPrice(_token?.symbol);

      if (!res) {
        setLoading(false);
      } else {
        let update: any = {};
        update[`${_token?.symbol}`] = res;
        dispatch({ type: SET_TOKEN_PRICE, payload: update });
        setLoading(false);
      }
    } catch (error) {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchData(poolToken);
  }, [poolToken]);

  return loading;
}
