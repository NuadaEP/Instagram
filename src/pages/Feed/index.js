import React, {useState, useEffect, useCallback} from 'react';
import {View, FlatList} from 'react-native';

import api from '~/services/api';

import {Post, Header, Avatar, Name, PostImage, Description} from './styles';

function Feed() {
  const [feed, setFeed] = useState([]);
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);

  const loadPage = useCallback(
    async (pageNumber = page, shoudRefresh) => {
      if (total && pageNumber > total) {
        return;
      }

      const response = await api.get(
        `/feed?_expand=author&_limit=5&_page=${pageNumber}`,
      );
      const totalItems = response.headers['x-total-count'];

      setTotal(Math.floor(totalItems / 5));
      setFeed([...feed, ...response.data]);
      setPage(pageNumber + 1);
    },
    [page, setPage, setFeed, feed, total, setTotal],
  );

  const renderItem = useCallback(
    ({item}) => (
      <Post>
        <Header>
          <Avatar source={{uri: item.author.avatar}} />
          <Name>{item.author.name}</Name>
        </Header>

        <PostImage ratio={item.aspectRatio} source={{uri: item.image}} />

        <Description>
          <Name>{item.author.name}</Name> {item.description}
        </Description>
      </Post>
    ),
    [],
  );

  useEffect(() => {
    loadPage();
  }, []);

  return (
    <View>
      <FlatList
        data={feed}
        keyExtractor={(post) => String(post.id)}
        onEndReached={() => loadPage()}
        onEndReachedThreshold={0.1}
        renderItem={renderItem}
      />
    </View>
  );
}

export default Feed;
