import React, {useState, useEffect, useCallback} from 'react';
import {View, FlatList} from 'react-native';

import api from '~/services/api';

import {Post, Header, Avatar, Name, PostImage, Description} from './styles';

function Feed() {
  const [feed, setFeed] = useState([]);
  const [page, setPage] = useState(1);

  async function loadPage(pageNumber = page, shoudRefresh) {
    const {data} = await api.get(
      `/feed?_expand=author&_limit=5&_page=${pageNumber}`,
    );

    setFeed([...feed, ...data]);
    setPage(pageNumber + 1);
  }

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
        renderItem={({item}) => (
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
        )}
      />
    </View>
  );
}

export default Feed;
