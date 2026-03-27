import { MetadataRoute } from 'next'

export default function manifest(): MetadataRoute.Manifest {
    return {
        name: 'CTF Challenges',
        short_name: 'CTF',
        description: 'The next-generation cybersecurity developer platform',
        start_url: '/',
        display: 'standalone',
        background_color: '#000000',
        theme_color: '#00FF41',
    }
}
