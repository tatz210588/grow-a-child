import React, { useEffect, useState } from 'react';
import Fancybox from './Fancybox';
import { Dna } from 'react-loader-spinner'
import { client, urlFor } from "../lib/sanityClient";


const Gallery = () => {

    const [photos, setPhotos] = useState([])
    const [contentLoaded, setcontentLoaded] = useState([])

    useEffect(() => {
        setcontentLoaded(false)
        loadPhotos()
    }, [])

    async function loadPhotos() {
        const query = '*[_type == "task"] {dailytask}'
        const result = await client.fetch(query)
        const baseUrl = urlFor(result[0]["dailytask"]["asset"]["_ref"].slice(6,))["options"].baseUrl
        const dataset = urlFor(result[0]["dailytask"]["asset"]["_ref"].slice(6,))["options"].dataset
        const projectId = urlFor(result[0]["dailytask"]["asset"]["_ref"].slice(6,))["options"].projectId

        const items = await Promise.all(
            result.map(async (i) => {
                let item = {
                    url:
                        `${baseUrl}/images/${projectId}/${dataset}/${i["dailytask"]["asset"]["_ref"]
                            .slice(6,).slice(0, -4) + '.'}png`

                };
                return item;
            })
        )
        console.log("itemssss", items)
        setPhotos(items)
        setcontentLoaded(true)
    }

    return (
        <section class="ftco-gallery mb-5">
            {!contentLoaded &&
                <div class='loader'>
                    <Dna
                        visible={true}
                        height="150"
                        width="150"
                        ariaLabel="dna-loading"
                        wrapperStyle={{}}
                        wrapperClass="dna-wrapper"
                    />
                </div>
            }



            {contentLoaded &&
                <div class="d-md-flex">
                    {photos.map((photo, i) =>
                        <Fancybox options={{ infinite: false }}>
                            <button class="gallery image-popup d-flex justify-content-center align-items-center img" data-fancybox="gallery"
                                style={{ backgroundImage: `url(${photo.url})` }}
                                data-src={photo.url}>
                                <div class="icon d-flex justify-content-center align-items-center">
                                    <span class="icon-search"></span>
                                </div>
                            </button>
                        </Fancybox>
                    )}
                </div>
            }


        </section>

    )

}
export default Gallery
