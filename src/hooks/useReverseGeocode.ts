import { useState, useCallback } from 'react'

export interface AddressDetails {
  fullAddress: string
  streetNumber: string
  streetName: string
  neighborhood: string
  city: string
  region: string
  country: string
  postalCode: string
  placeId: string
}

export interface GeocodeState {
  address: AddressDetails | null
  loading: boolean
  error: string | null
}

function extractComponent(
  components: google.maps.GeocoderAddressComponent[],
  type: string,
  useShortName = false
): string {
  const comp = components.find(c => c.types.includes(type))
  return comp ? (useShortName ? comp.short_name : comp.long_name) : ''
}

export function useReverseGeocode() {
  const [state, setState] = useState<GeocodeState>({
    address: null,
    loading: false,
    error: null,
  })

  const geocode = useCallback(
    async (lat: number, lng: number, apiKey: string) => {
      setState({ address: null, loading: true, error: null })

      try {
        const url = `https://maps.googleapis.com/maps/api/geocode/json?latlng=${lat},${lng}&key=${apiKey}`
        const res = await fetch(url)

        if (!res.ok) {
          throw new Error(`HTTP error: ${res.status}`)
        }

        const data = await res.json()

        if (data.status === 'REQUEST_DENIED') {
          throw new Error(
            data.error_message || 'API key is invalid or missing required permissions.'
          )
        }

        if (data.status === 'ZERO_RESULTS' || !data.results?.length) {
          throw new Error('No address found for your coordinates.')
        }

        if (data.status !== 'OK') {
          throw new Error(`Geocoding failed: ${data.status}`)
        }

        const result = data.results[0]
        const comps: google.maps.GeocoderAddressComponent[] = result.address_components

        const details: AddressDetails = {
          fullAddress: result.formatted_address,
          streetNumber: extractComponent(comps, 'street_number'),
          streetName: extractComponent(comps, 'route'),
          neighborhood:
            extractComponent(comps, 'neighborhood') ||
            extractComponent(comps, 'sublocality_level_1'),
          city:
            extractComponent(comps, 'locality') ||
            extractComponent(comps, 'administrative_area_level_2'),
          region: extractComponent(comps, 'administrative_area_level_1'),
          country: extractComponent(comps, 'country'),
          postalCode: extractComponent(comps, 'postal_code'),
          placeId: result.place_id,
        }

        setState({ address: details, loading: false, error: null })
      } catch (err) {
        setState({
          address: null,
          loading: false,
          error: err instanceof Error ? err.message : 'Unexpected geocoding error.',
        })
      }
    },
    []
  )

  return { ...state, geocode }
}
