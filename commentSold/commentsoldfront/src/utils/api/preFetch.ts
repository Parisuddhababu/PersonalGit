import { DEFAULT_PRIMARY_COLOR } from "@/constant/common";
import { getClient } from "@/framework/graphql/ApolloClient";
import { FIND_BRAND_REGISTER, GET_PRIMARY_COLOR } from "@/framework/graphql/queries/theme";
import { checkIsBrandDomain } from "../helpers";
import { FETCH_POLICY_DETAILS } from "@/framework/graphql/queries/policy";

export async function getPrimaryColor(host: string | null) {
  let primaColor = DEFAULT_PRIMARY_COLOR;

  try {
    const { data } = await getClient().query({
      query: GET_PRIMARY_COLOR,
      context: {
        headers: {
          origin: host,
        },
      },
    });
    if (data?.getPrimaryColor?.data?.primary_color) {
      primaColor = data?.getPrimaryColor?.data?.primary_color;
    }

    return primaColor;
  } catch {
    return primaColor;
  }
}

export async function findBrandRegister(host: string | null) {
  if (!checkIsBrandDomain(host)) {
    return true;
  }

  try {
    const { data } = await getClient().query({
      query: FIND_BRAND_REGISTER,
      context: {
        headers: {
          origin: host,
        },
      },
    });
    return data?.findBrandRegister?.data?.is_brand_register ?? false;
  } catch {
    return true;
  }
}

export async function getTermsOfUse() {
  let HTMLString = "";

  try {
    const { data } = await getClient().query({
      query: FETCH_POLICY_DETAILS,
    });

    if (data?.fetchPolicyDetails) {
      const policyData = data?.fetchPolicyDetails?.data;
      policyData.map((i: { key: string; value: string }) => {
        if (i.key === "terms_of_use") {
          HTMLString = i.value;
        }
      });
    }

    return HTMLString;
  } catch (error) {
    return HTMLString;
  }
}


export async function getPrivacyPolicy() {
  let HTMLString = "";

  try {
    const { data } = await getClient().query({
      query: FETCH_POLICY_DETAILS,
    });

    if (data?.fetchPolicyDetails) {
      const policyData = data?.fetchPolicyDetails?.data;
      policyData.map((i: { key: string; value: string }) => {
        if (i.key === "privacy_policy") {
          HTMLString = i.value;
        }
      });
    }
    
    return HTMLString;
  } catch (error) {
    return HTMLString;
  }
}
