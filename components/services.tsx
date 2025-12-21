import React from 'react';
import { useRouter } from "next/router";
import MuiButton from "@mui/material/Button";
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import Card from "components/card";
import { Service } from 'types';

interface Props {
    service: Service,
    returnRoute?: {
        path: string,
        name: string
    }
}

const Services = ({ service, returnRoute }: Props) => {
    const router = useRouter();
    const { name, description, services } = service
    return (
        <section style={{ padding: '3rem 5%' }}>
            {returnRoute && (
                <MuiButton
                    sx={{
                        textTransform: "none",
                        letterSpacing: "2px",
                        color: "lightgray",
                        justifyContent: "flex-start",
                        padding: "0.5rem",
                        fontFamily: "inherit",
                    }}
                    size="medium"
                    startIcon={<ChevronLeftIcon />}
                    onClick={() => router.push(returnRoute.path)}
                >
                    {returnRoute.name}
                </MuiButton>
            )}
            <h1 style={{ fontSize: '3rem', textAlign: 'center' }}>{name}</h1>
            <p>{description}</p>
            <div className="services-content">
                {services && services.map((option, idx) => (
                    <Card key={idx} service={option} height='25rem' />
                ))}
            </div>
        </section>
    )
}

export default Services