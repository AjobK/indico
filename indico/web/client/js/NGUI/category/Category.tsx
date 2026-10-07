// This file is part of Indico.
// Copyright (C) 2002 - 2026 CERN
//
// Indico is free software; you can redistribute it and/or
// modify it under the terms of the MIT License; see the
// LICENSE file for more details.

import apiCategoryChildrenURL from 'indico-url:categories.api_category_children';
import apiCategoryInfoURL from 'indico-url:categories.api_category_info';
import apiEventListWithMetaDataURL from 'indico-url:categories.api_event_list_with_meta_data';

import React from 'react';
import remarkRehype from 'remark-rehype';

import {Card} from 'indico/NGUI/card/Card';
import {CategoryCardList} from 'indico/NGUI/card/CategoryCardList';
import {EventList} from 'indico/NGUI/list/EventList';
import {CategoryEventListWithMetaData, CategoryMetaData, CategoryType} from 'indico/NGUI/types';
import {useIndicoAxios} from 'indico/react/hooks/hooks';
import {Markdown} from 'indico/react/util';
import {Translate} from 'indico/react/i18n';

import './Category.module.scss';
import {CategorySidebar} from '../category_sidebar/CategorySidebar';

interface CategoryProps {
  categoryId: number;
  isFlat?: boolean;
}

export function Category({categoryId, isFlat}: CategoryProps) {
  const {data: categoryInfo, loading: categoryLoading} = useIndicoAxios(
    {url: apiCategoryInfoURL({category_id: categoryId})},
    {camelize: true}
  );

  const category = categoryInfo as CategoryType;

  const {data: categoryChildrenData, loading: childrenLoading} = useIndicoAxios(
    {url: apiCategoryChildrenURL({category_id: categoryId})},
    {camelize: true}
  );

  const categoryChildren = categoryChildrenData as {categories: CategoryMetaData[]};

  const {data: categoryEventListWithMetaData, loading: categoryEventListWithMetaDataLoading} =
    useIndicoAxios(
      {
        url: apiEventListWithMetaDataURL({
          category_id: categoryId,
          flat: isFlat ? 1 : 0,
        }),
      },
      {
        camelize: true,
      }
    );

  const categoryEventListWithMeta = categoryEventListWithMetaData as CategoryEventListWithMetaData;

  if (!category || categoryLoading || !categoryChildren || childrenLoading) {
    return null;
  }

  const isUntitledRoot = category.title === 'Home' && category.isRoot;

  // (Ajob) Honestly, I think the whole idea of checking the string for 'Home' is very hacky
  let title;
  if (isUntitledRoot) {
    title = (
      <Translate>{category.hasChildren ? 'Main categories' : 'All events'}</Translate>
    );
  } else {
    title = category.title
  }

  return (
    <section styleName="category">
      <Card styleName="category-main">
        {title}
        <section styleName="category-info">
          {category.logoURL && (
            <img styleName="category-logo" src={category.logoURL} alt={category.title} />
          )}
          <div styleName="category-description">
            {/* Markdown will be replaced by custom solution */}
            <Markdown rehypePlugins={[remarkRehype]}>{category.description}</Markdown>
          </div>
        </section>
        {!isFlat && <CategoryCardList data={categoryChildren.categories} />}
      </Card>
      <CategorySidebar categoryId={categoryId} isFlat={isFlat} />
    </section>
  );
}
