import '../lib/makeswift/register-components'

export {
  getStaticPaths,
} from '@makeswift/runtime/next'

import { getStaticProps as getStaticMakeswiftProps, Page, PageProps } from '@makeswift/runtime/next';
import { GetStaticPropsContext, PreviewData } from 'next';
import { SWRConfig } from 'swr';
import { get } from 'lodash';

const fetchFromEndpoint = (_key: string) => {

  return Promise.resolve(
    {
        "abc": "def",
        "def": [
          1, "2"
        ]
    }
  )

}


const preloaded: DataMapping = {
  
  '/': [
    '/data'
  ],
  '/protocols': []
}



const fetcher = async (key: string, sep: string = "$$") => {
  const [endpoint, objectKey] = key.split(sep);
  const endpointData = await fetchFromEndpoint(endpoint);
  return objectKey ? get(endpointData, objectKey) : endpointData;
}

type DataMapping = {
  [key: string]: string[];
}

type Data = {
  [key: string]: any;
}

const destructure = (object: any, currentPath: string, data: Data = {}) => {

  if (Array.isArray(object)) {
    object.forEach((v, i) => {
      destructure(v, `${currentPath}[${i}]`, data); 
    });
  } else if (typeof object === 'object') {
    Object.entries(object).forEach(([k, v]) => {
      if (currentPath.endsWith("$$")) {
        destructure(v, `${currentPath}${k}`, data);
      } else {
        destructure(v, `${currentPath}.${k}`, data);

      }
    })
  } else {
    data[currentPath] = object; 
  }

  return data;

}


export const getStaticProps = async (props: GetStaticPropsContext<{ path: string[]; }, PreviewData>) => {
  const makeswiftResults = await getStaticMakeswiftProps(props);
  const fullEndpoint = props?.params?.path?.join("/") || "/";
  const relevantDataKeysForPage = preloaded[fullEndpoint] ?? [];
  const data: {
    [key: string]: any
  } = {};
  for (const key of relevantDataKeysForPage) {
    data[key] = await fetcher(key);
  }

  return { ...makeswiftResults, props: {
      // @ts-ignore
     ...makeswiftResults?.props,
     fallback: Object.entries(data).reduce((acc, [key, value]) => ({
      ...acc,
      ...destructure(value, `${key}$$`, {}),
      [key]: value,
}), {})
     
    } 
  }  
}

type Fallback = {
  [key: string]: any;
}


const IndexPage = ({fallback, ...props}: PageProps & Fallback) => {
  console.log(fallback)
  return <SWRConfig value={{ fallback, fetcher }}><Page {...props} /></SWRConfig>
}

export default IndexPage;