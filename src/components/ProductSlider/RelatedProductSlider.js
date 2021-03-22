import React, { useEffect, useState } from 'react';
import Swiper from 'react-id-swiper';
import styles from './style.css';
import stylesIndex from '../ProductDetail/productDetail.css';
import { useQuery } from '@apollo/client';

import sliderQuery from './productSlider.gql';
// import Product from "@magento/venia-ui/lib/components/Gallery";
import GalleryItem from "@magento/venia-ui/lib/components/Gallery/item";

const mapGalleryItem = item => {
    const { small_image } = item;
    return {
        ...item,
        small_image:
            typeof small_image === 'object' ? small_image.url : small_image
    };
};

const RelatedProductSlider = (urlKey) => {
    const { queries } = sliderQuery;
    const { getRelatedProductQuery } = queries;
    const { data, error, loading } = useQuery(getRelatedProductQuery,
        {
            variables: {
                url_key: urlKey.urlKey
            },
        });
    const params = {
        slidesPerView: 5,
        spaceBetween: 30,
        breakpoints: {
            1281: {
                slidesPerView: 7
            },
            1024: {
                slidesPerView: 5
            },
            768: {
                slidesPerView: 4
            },
            640: {
                slidesPerView: 3
            },
            320: {
                slidesPerView: 2
            }
        }
    };
    if (loading) return null;
    const galleryItems = data.products.items.map((item, index) => {
        if (item.related_products.length > 0) {
            return item.related_products.map((item, index) => {
                return (
                    <div key={index}>
                        <GalleryItem key={index} item={mapGalleryItem(item)} />
                    </div>
                );
            });
        } else {
            return null;
        }
    });
    if (galleryItems[0] !== null) {
        return (
            <div>
                <div className={stylesIndex.title}>
                    <h2>Related products</h2>
                </div>
                <div className="product-slider-container">
                    <Swiper {...params}>{galleryItems}</Swiper>
                </div>
            </div>
        );
    } else {
        return null;
    }
};
export default RelatedProductSlider;
