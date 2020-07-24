import React, {useState, useEffect, useCallback} from 'react';
import {View, FlatList} from 'react-native';

import LazyImge from '~/components/LazyImage';

import api from '~/services/api';

import {Post, Header, Avatar, Name, Description, Loading} from './styles';

function Feed() {
  const [feed, setFeed] = useState([]);
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [viewable, setViewable] = useState([]);

  const loadPage = useCallback(
    async (pageNumber = page, shoudRefresh = false) => {
      if (total && pageNumber > total) {
        return;
      }

      setLoading(true);

      const response = await api.get(
        `/feed?_expand=author&_limit=5&_page=${pageNumber}`,
      );
      const totalItems = response.headers['x-total-count'];

      setTotal(Math.floor(totalItems / 5));
      setFeed(shoudRefresh ? response.data : [...feed, ...response.data]);
      setPage(pageNumber + 1);
      setLoading(false);
    },
    [page, setPage, setFeed, feed, total, setTotal, setLoading],
  );

  const handleViewableChanged = useCallback(
    ({changed}) => {
      setViewable(changed.map(({item}) => item.id));
    },
    [setViewable],
  );

  const renderItem = useCallback(
    ({item}) => (
      <Post>
        <Header>
          <Avatar source={{uri: item.author.avatar}} />
          <Name>{item.author.name}</Name>
        </Header>

        <LazyImge
          shouldLoad={viewable.includes(item.id)}
          aspectRatio={item.aspectRatio}
          source={{uri: item.image}}
          smallSource={{uri: item.small}}
        />

        <Description>
          <Name>{item.author.name}</Name> {item.description}
        </Description>
      </Post>
    ),
    [viewable],
  );

  const refreshList = useCallback(async () => {
    setRefreshing(true);

    await loadPage(1, true);

    setRefreshing(false);
  }, [setRefreshing, loadPage]);

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
        onRefresh={refreshList}
        refreshing={refreshing}
        onViewableItemsChanged={handleViewableChanged}
        viewabilityConfig={{
          viewAreaCoveragePercentThreshold: 20,
        }}
        ListFooterComponent={loading && <Loading />}
        renderItem={renderItem}
      />
    </View>
  );
}

export default Feed;
