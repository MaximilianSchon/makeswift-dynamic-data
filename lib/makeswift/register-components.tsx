import { Color, Style, TextInput } from '@makeswift/runtime/controls'
import { ReactRuntime } from '@makeswift/runtime/react'
import useSWR from 'swr'

// Register your components here!

function DataText({dataURL, placeholder, color, ...props}: { placeholder?: string, color: string, dataURL?: string, className?: string }) {
  const { data, error } = useSWR(dataURL)
  return <p style={{color}} {...props}>{data ? data : (placeholder ?? dataURL ?? 'Data-URL & placeholder missing')}</p>
}

ReactRuntime.registerComponent(DataText, {
  type: 'text',
  label: 'Data Text',
  props: {
    className: Style({ properties: Style.All }),
    dataURL: TextInput({
      label: "Data-URI"
    }),
    placeholder: TextInput({
      label: "Placeholder"
    }),
    color: Color({ label: 'Text color', defaultValue: 'white' }),
  },
})


function DataImage({dataURL, alt, ...props}: { alt?: string, dataURL?: string, className?: string }) {
  const { data, error } = useSWR(dataURL)
  return <img src={data} alt={alt} {...props} />
}

ReactRuntime.registerComponent(DataImage, {
  type: 'image',
  label: 'Data Image',
  props: {
    className: Style({ properties: Style.All }),
    dataURL: TextInput({
      label: "Data-URI"
    }),
    alt: TextInput({
      label: "Alternative"
    }),
  },
})

