import React from 'react'
import type { Price } from 'types'
import { PriceType } from 'types'

interface Props {
    price: Price
}

const { HOURLY, STARTING } = PriceType;

const Price = ({ price }: Props) => {
    switch (price.type) {
        case HOURLY:
            return (
                <>
                    <p>${price.value}</p>
                    <span>PER HOUR</span>
                </>
            )

        case STARTING:
            return (
                <>
                    <p>${price.value}</p>
                    <span>STARTING PRICE</span>
                </>
            )

        default:
            return <p>${price.value}</p>
    }
}

export default Price