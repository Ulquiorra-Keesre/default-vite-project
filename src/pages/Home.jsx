import React, { useState, useRef } from 'react'
import {
    chakra,
    Button,
    List,
    ListItem,
    Heading,
    Flex,
    Input,
    Text,
    Select
} from '@chakra-ui/react'

export const Home  = () => {
    const [todos, setTodos] = useState([])
    const [text, setText] = useState('')
    const [sortBy, setSortBy] = useState('name')
    const [filter, setFilter] = useState('')

    const fileInputRef = React.useRef(null)

    const createTodoHandler = (text) => {
        setTodos((prevState) => [...prevState, { id: Date.now(), text, status: 'Pending' }])
        setText('')
        //a = [1,2,3] => b = [...[1,2,3], 4,5,6] = [1,2,3,4,5,6]
    }

    const handleStatusChange = (id, newStatus) => {
        setTodos((prevState) =>
            prevState.map((todo) =>
                todo.id === id ? { ...todo, status: newStatus } : todo
            )
        );
    };
    

    const removeTodoHandler = (id) => {
        setTodos( (prevState) => prevState.filter( (todo) => todo.id !== id))
    }

    const handleSort = () => {
        setTodos((prevState) =>
            prevState.slice().sort((a, b) => {
                if (sortBy === 'name') {
                    return a.text.localeCompare(b.text);
                } else {
                    
                    return a.status.localeCompare(b.status);
                }
            })
        );
    };

    const handleFilter = () => {
        
        setTodos((prevState) =>
            prevState.filter((todo) =>
                todo.text.toLowerCase().includes(filter.toLowerCase())
            )
        );
    };
    
    const handleImportTasks = (e) => {
        const file = e.target.files[0];

        if (file) {
            const reader = new FileReader();

            reader.onload = (event) => {
                try {
                    const importedTasks = JSON.parse(event.target.result);
                    setTodos(importedTasks);
                } catch (error) {
                    console.error('Error parsing imported tasks:', error);
                }
            };

            reader.readAsText(file);
        }
    };

    const handleExportTasks = () => {
        const content = JSON.stringify(todos, null, 2);
        const blob = new Blob([content], { type: 'application/json' });
        const url = URL.createObjectURL(blob);

        const a = document.createElement('a');
        a.href = url;
        a.download = 'todos.json';
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
    };

    return (
        <Flex
            flexDirection="column"
            h="100vh"
            w="100vw"
            m="1rem"
            gap="1rem"
            alignItems="center"
        >

            <Heading textTransform="uppercase">Todo List</Heading>
            <List
                h="60hv"
                w="70vw"
                display="flex"
                flexDirection="column"
                overflowY="scroll"
                border="2px solid black"
                borderRadius="md"
                p="10px"
            >
                {todos.map ( (todo) => (
                    <ListItem
                        key={todo.id}
                        display="flex"
                        justifyContent="space-between"
                        alignItems="center"
                        borderBottom="1px solid gray"
                        py="8px"
                    >

                    <Flex flexDirection="column">
                        <Text>{`Task: ${todo.text}`}</Text>
                        <Text>{`Status: ${todo.status}`}</Text>
                    </Flex>
                    <Flex alignItems="center">
                        <Select
                            value={todo.status}
                            onChange={(e) => handleStatusChange(todo.id, e.target.value)}
                            mr="4"
                        >
                            <option value="Pending">Pending</option>
                            <option value="That's Completed">Completed</option>
                        </Select>
                        </Flex>

                        <Button
                            onClick={ () => removeTodoHandler(todo.id)}
                            background="red.500"
                            color="white"
                            _hover={ {
                                background: 'red.600',
                            }}
                        >
                            Удалить
                        </Button>
                    </ListItem>    
                ))}
            </List>

            <Flex 
            flexDirection="column"
            h="25vh"
            w="50vw"
            m="1rem"
            gap="1rem"
            alignItems="center"
            >
                <Select value={sortBy} onChange={(e) => setSortBy(e.target.value)}>
                    <option value="name">Сортировка по имени</option>
                    <option value="status">Сортировка по состоянию</option>
                </Select>

                <Input
                    placeholder="Фильтр по имени"
                    value={filter}
                    onChange={(e) => setFilter(e.target.value)}
                    w="200px"
                />

                <Button onClick={handleSort}>
                    Сортировать
                </Button>

                <Button onClick={handleFilter}>
                    Фильтровать
                </Button>
            </Flex>

            <chakra.form
                onSubmit={ (e) => {
                    e.preventDefault () //Без перезагрузки приложения после
//добавления хадачи
                    createTodoHandler(text)
                }}
                display="flex"
                flexDirection="column"
                alignItems="center"
                gap="20px"
            >
                <Input
                    placeholder="Напишите задачу..."
                    maxLength={80}
                    value={text}
                    onChange={ (e) => setText(e.target.value) }
                    w="300px"
                    h="32px"
                />
                <Button
                    isDisabled={!text.trim().length}
                    type="submit"
                    w="fit-content"
                    background="blue.500"
                    color="white"
                    _hover={ {
                        background: 'blue.600',
                    }}
                >
                    Добавить задачу
                </Button>
            </chakra.form>

            <Button
                onClick={handleExportTasks}
                background="green.500"
                color="white"
                _hover={{
                    background: 'green.600',
                }}
            >
                Экспорт задач
            </Button>

            <Input
                type="file"
                accept=".json"
                onChange={handleImportTasks}
                style={{ display: 'none' }}
                ref={fileInputRef}
            />
            <Button
                onClick={() => fileInputRef.current.click()}
                background="yellow.500"
                color="white"
                _hover={{
                    background: 'yellow.600',
                }}
            >
                Импорт задач
            </Button>

        </Flex>
    )
}


