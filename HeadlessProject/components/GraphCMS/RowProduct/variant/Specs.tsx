import { ProductMoreInformation } from '@components/ProductDetails/ProductMoreInformation/ProductMoreInformation'
import { GetMoreInformationQuery } from '@graphql/ProductSpecs/GetMoreInformation.gql'

type SpecsProps = GetMoreInformationQuery

export function Specs(props: SpecsProps) {
  const { GetMoreInformation } = props
  const specifications = GetMoreInformation?.allAttributeRecords
  if (!GetMoreInformation) return <h3>Specification Not Available</h3>

  return <>{specifications && <ProductMoreInformation allAttributeRecords={specifications} />}</>
}
