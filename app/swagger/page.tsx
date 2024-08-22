import React from 'react';
import dynamic from 'next/dynamic';
import 'swagger-ui-react/swagger-ui.css';
import { options } from '@/config/swaggerConfig';
import swaggerJSDoc from 'swagger-jsdoc';

const SwaggerUI = dynamic(() => import('swagger-ui-react'), { ssr: false });

const swaggerSpec = swaggerJSDoc(options);

export default function SwaggerPage() {
  return <SwaggerUI spec={swaggerSpec} />;
}
